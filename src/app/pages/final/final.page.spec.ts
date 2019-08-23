import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalPage } from './final.page';

describe('FinalPage', () => {
  let component: FinalPage;
  let fixture: ComponentFixture<FinalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
