import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListFoodPage } from './list-food.page';

describe('ListFoodPage', () => {
  let component: ListFoodPage;
  let fixture: ComponentFixture<ListFoodPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFoodPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListFoodPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
