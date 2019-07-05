import { FirebaseAppConfig } from '@angular/fire';

export interface IConfig {
  firebaseConfig: FirebaseAppConfig;
  functionsUrl: string;
  editorUrl: string;
  hightlighJsURL: string;
  hightlighCSSURL: string;
  katexCSSURL: string;
}
