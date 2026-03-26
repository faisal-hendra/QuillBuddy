use std::env;
use tauri::Manager;
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut};
use tauri_plugin_sql::{Migration, MigrationKind};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_os_name() -> String {
    let os: String = env::consts::OS.to_string();
    format!("{}", os)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![Migration {
        version: 1,
        description: "create profile table",
        sql: "CREATE TABLE IF NOT EXISTS profile (  
                id INTEGER PRIMARY KEY AUTOINCREMENT,  
                provider TEXT NOT NULL UNIQUE,  
                api_key TEXT
            )",
        kind: MigrationKind::Up,
    }];

    println!("Migrations defined: {}", migrations.len());

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:profile.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_python::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_os_name])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            let window_clone = window.clone();

            // Intercept close to hide instead
            window.on_window_event(move |event| match event {
                tauri::WindowEvent::CloseRequested { api, .. } => {
                    api.prevent_close();
                    window_clone.hide().unwrap();
                }
                _ => {}
            });
            // hotkey registration for macOS
            #[cfg(target_os = "macos")]
            app.global_shortcut().on_shortcut(
                Shortcut::new(Some(Modifiers::SUPER), Code::Slash),
                move |_app, _shortcut, event| {
                    if event.state() == tauri_plugin_global_shortcut::ShortcutState::Pressed {
                        if let Some(win) = _app.get_webview_window("main") {
                            let _ = win.show();
                            let _ = win.set_focus();
                        }
                    }
                },
            )?;
            // hotkey registration for Windows
            #[cfg(target_os = "windows")]
            app.global_shortcut().on_shortcut(
                Shortcut::new(Some(Modifiers::CONTROL), Code::Slash),
                move |_app, _shortcut, event| {
                    if event.state() == tauri_plugin_global_shortcut::ShortcutState::Pressed {
                        if let Some(win) = _app.get_webview_window("main") {
                            // Check if window is visible AND not minimized
                            let is_visible = win.is_visible().unwrap_or(false);
                            let is_minimized = win.is_minimized().unwrap_or(false);

                            if is_visible && !is_minimized {
                                // Window is active - hide it
                                let _ = win.hide();
                            } else {
                                // Window is hidden or minimized - show and restore
                                let _ = win.unminimize();
                                let _ = win.show();
                                let _ = win.set_focus();
                            }
                        }
                    }
                },
            )?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
