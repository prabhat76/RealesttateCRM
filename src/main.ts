import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => console.log('App bootstrapped successfully'))
  .catch(err => {
    console.error('Error bootstrapping app:', err);
    // Display error on page for debugging
    document.body.innerHTML = `
      <div style="padding: 20px; font-family: Arial; max-width: 800px; margin: 50px auto;">
        <h1 style="color: red;">Application Failed to Load</h1>
        <p>Please check the browser console for details.</p>
        <pre style="background: #f5f5f5; padding: 15px; overflow: auto;">${err.message}</pre>
      </div>
    `;
  });