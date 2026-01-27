import { Component } from '@angular/core';
import { FormInput } from "../../components/shared/form-input/form-input";
import { Sidebar } from '../../components/layout/sidebar/sidebar';
import { Button } from "../../components/shared/button/button";
import { FormTextarea } from "../../components/shared/form-textarea/form-textarea";
import { FormSelect } from "../../components/shared/form-select/form-select";
import { FormCheckbox } from "../../components/shared/form-checkbox/form-checkbox";
import { Card } from '../../components/shared/card/card';
import { Alert } from '../../components/shared/alert/alert';
import { FeatherIconDirective } from '../../directives/feather-icon.directive';
import { LoginForm } from "../../components/shared/login-form/login-form";
import { RegistroForm } from "../../components/shared/registro-form/registro-form";

// Guía de estilo con todos los componentes UI disponibles (para desarrollo y diseño)
@Component({
  selector: 'app-style-guide',
  templateUrl: './style-guide.html',
  standalone: true,
  styleUrls: ['./style-guide.scss'],
  imports: [FormInput, Sidebar, Button, FormTextarea, FormSelect, FormCheckbox, Card, Alert, FeatherIconDirective, LoginForm, RegistroForm]
})
export class StyleGuidePage {
}

