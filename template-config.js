const fs = require('fs');
const path = require('path');

const deleteFile = filename => {
  try {
    return fs.unlinkSync(path.join(__dirname, filename));
  } catch (error) {}
};
const deleteFolder = path => {
  try {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file, index) {
        const currentPath = `${path}/${file}`;
        if (fs.lstatSync(currentPath).isDirectory()) {
          deleteFolder(currentPath);
        } else {
          deleteFile(currentPath);
        }
      });
      fs.rmdirSync(path);
    }
  } catch (error) {}
};

const packagePath = path.join(__dirname, 'package.json');
const packageJSON = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const name = packageJSON.name;
const mainActivityPath = path.join(
  __dirname,
  `android/app/src/main/java/com/${name.toLowerCase()}/MainActivity.java`,
);

console.log('\n 📝 Adicionando configurações no arquivo MainActivity.java');

// Write imports and methods in the file.
try {
  fs.writeFileSync(
    mainActivityPath,
    `
package com.${name.toLowerCase()};

import com.facebook.react.ReactActivity;

import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "${name}";
  }

  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
        return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }
}`,
  );

  console.log('\n ✅ Configurações adicionadas.');
} catch (error) {
  console.log(
    '\nFalha ao adicionar configurações no arquivo MainActivity.java\n',
  );
  console.error(error);
}

console.log('\n 🧹 Limpando diretórios e arquivos desnecessários.');

// Delete folder and files
deleteFolder('__tests__');
deleteFile('App.js');
deleteFile('template-config.js');

console.log('\n ✅ Tudo pronto.');
