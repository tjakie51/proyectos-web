const gulp = require("gulp");
const browserSync = require("browser-sync").create();

// Tarea para iniciar BrowserSync
gulp.task("serve", () => {
  browserSync.init({
    server: {
      baseDir: "./", // Directorio raíz de tu proyecto
    },
  });

  // Vigilar cambios en archivos .html y .css
  gulp.watch("*.html").on("change", browserSync.reload);
  gulp.watch("*.css").on("change", browserSync.reload);
  gulp.watch("*.js").on("change", browserSync.reload);
});
