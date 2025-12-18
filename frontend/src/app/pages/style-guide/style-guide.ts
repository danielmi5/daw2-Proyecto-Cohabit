import { Component } from '@angular/core';
import { FormInput } from "../../components/shared/form-input/form-input";
import { Sidebar } from '../../components/layout/sidebar/sidebar';
import { Button } from "../../components/shared/button/button";
import { FormTextarea } from "../../components/shared/form-textarea/form-textarea";
import { FormSelect } from "../../components/shared/form-select/form-select";
import { FormCheckbox } from "../../components/shared/form-checkbox/form-checkbox";
import { Card } from '../../components/shared/card/card';
import { FeatherIconDirective } from '../../directives/feather-icon.directive';

@Component({
  selector: 'app-style-guide',
  templateUrl: './style-guide.html',
  standalone: true,
  styleUrls: ['./style-guide.scss'],
  imports: [FormInput, Sidebar, Button, FormTextarea, FormSelect, FormCheckbox, Card, FeatherIconDirective]
})
export class StyleGuidePage {}
