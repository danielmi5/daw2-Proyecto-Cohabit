import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tooltip } from '../../shared/tooltip/tooltip';

// Footer con enlaces de navegación y copyright
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, Tooltip],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
})
export class Footer {
}
