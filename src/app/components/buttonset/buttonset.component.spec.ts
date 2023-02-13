import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { MatCardHarness, MatCardSection } from '@angular/material/card/testing';
import { MatProgressBarHarness } from '@angular/material/progress-bar/testing';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ButtonsetComponent, ClickButtonset } from './buttonset.component';

describe('ButtonsetComponent', () => {
  let component: ButtonsetComponent;
  let fixture: ComponentFixture<ButtonsetComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatGridListModule,
        MatCardModule,
        MatRippleModule,
        MatProgressBarModule,
      ],
      declarations: [ButtonsetComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonsetComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeInstanceOf(ButtonsetComponent);
  });

  const buttonset = [
    'aaa',
    'bbb',
    'ccc'
  ];
  beforeEach(async () => {
    component.multiple = true;
    component.buttonset = buttonset;
    fixture.detectChanges();
  });

  it('should be set true multiple', () => {
    expect(component.multiple).toEqual(true);
  });

  it('should be created button management state', () => {
    for (const name of buttonset) {
      expect(component.buttonsetState.get(name)?.name).toEqual(name);
      expect(component.buttonsetState.get(name)?.started).toEqual(false)
    }
  });

  it('should be created card', async () => {
    expect((await loader.getAllHarnesses(MatCardHarness)).length).toEqual(buttonset.length);

    for (const name of buttonset) {
      const card = await loader.getHarness(MatCardHarness.with({
        title: name
      }))
      expect(card).toBeTruthy();
      expect(await card.getTitleText()).toEqual(name);
    }
  });

  it('should be update internal state', async () => {
    let clickButtonset: ClickButtonset | undefined;
    component.clickButtonset.subscribe((event: ClickButtonset) => {
      clickButtonset = event;
    });
    for (const name of buttonset) {
      const card = await loader.getHarness(MatCardHarness.with({
        title: name
      }))
      await (await card.host()).click();
      expect(clickButtonset?.button).toEqual(name);
      expect(clickButtonset?.event).toEqual('START');
      expect(clickButtonset?.time).not.toBeNull();
      fixture.detectChanges();
      expect(component.buttonsetState.get(name)?.started).toEqual(true);
      // should be indeterminate mode
      expect(await (await (await card.getChildLoader(MatCardSection.FOOTER)).getHarness(MatProgressBarHarness)).getMode()).toEqual('indeterminate');
      await (await card.host()).click();
      expect(clickButtonset?.button).toEqual(name);
      expect(clickButtonset?.event).toEqual('END');
      expect(clickButtonset?.time).not.toBeNull();
      fixture.detectChanges();
      expect(component.buttonsetState.get(name)?.started).toEqual(false);
      // should be determinate mode
      expect(await (await (await card.getChildLoader(MatCardSection.FOOTER)).getHarness(MatProgressBarHarness)).getMode()).toEqual('determinate');
    }
  });
});
