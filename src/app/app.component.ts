import { Component, VERSION } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {concatMap, map, filter, catchError, switchMap, tap, shareReplay, startWith} from 'rxjs/operators'
import {Observable} from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
@Component({
  selector: 'app-root',
  template: `
    <mat-form-field>
      <input matInput [formControl]="control" placeholder="Search for a Schematics Package">
    </mat-form-field>

    <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>

    <ng-container *ngIf="schematicsNames$ | async as schematicsNames">
      <div *ngIf="schematicsNames.length > 0; else noItems" class="npm-pkg-container">
        <a *ngFor="let pkgname of schematicsNames" [href]="'https://www.npmjs.com/package/' + pkgname" class="npm-pkg">
          {{pkgname}}
        </a>
      </div>

      <ng-template #noItems>
        No matches
      </ng-template>

    </ng-container>

  `, styles: [`
    input {
      width: 500px;
    }
    .npm-pkg {
      text-decoration: none;
      color: black;
      width: 50%;
      display: block;
      background-color: lightgray;
      padding: 10px;
      margin: 2px;
    }
    .npm-pkg:hover {
      cursor: pointer;
      background-color: gray;
    }
    .npm-pkg-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    mat-form-field{
      width: 500px;
    }
  `]
})
export class AppComponent implements OnInit  {
  control = new FormControl();
  schematicsNames$: Observable<any[]>;
  loading = false;

  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.schematicsNames$ = this.control.valueChanges.pipe(
      tap(() => this.loading = true),
      switchMap(query => this.http.get(`https://npmsearch.com/query?q=${query}&fields=name`)),
      map(res => res['results'].map(item => item.name).reduce((a, b) => a.concat(b), [])),
      switchMap(packageNames => forkJoin(...packageNames.map(name =>
        this.http.get(`https://unpkg.com/${name}/package.json`)
          .pipe(catchError(err => of({})))
      ))),
      catchError(err => of([])),
      map((packages: any[]) =>
        packages.filter(pkg => pkg['schematics']).map(pkg => pkg['name'])
      ),
      tap(() => this.loading = false),
    );
  }
}
