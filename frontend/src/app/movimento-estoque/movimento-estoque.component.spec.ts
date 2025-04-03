import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovimentoEstoqueComponent } from './movimento-estoque.component';

describe('MovimentoEstoqueComponent', () => {
  let component: MovimentoEstoqueComponent;
  let fixture: ComponentFixture<MovimentoEstoqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimentoEstoqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimentoEstoqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
