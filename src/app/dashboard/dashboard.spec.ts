import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard'; // ✅ nombre correcto
import { ChatbotComponent } from '../chatbot/chatbot'; // ✅ importa el chatbot
import { ProfileComponent } from '../profile/profile'; // ✅ importa el perfil

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent, // Standalone principal
        ChatbotComponent,   // Dependencia
        ProfileComponent    // Dependencia
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
