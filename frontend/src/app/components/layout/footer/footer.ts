import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Tooltip } from '../../shared/tooltip/tooltip';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, Tooltip],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
})
export class Footer {
}
