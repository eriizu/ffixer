const { GObject, Meta } = imports.gi;

class Extension {
    _onActiveWorkspaceChanged() {
        const activeWs = global.workspace_manager.get_active_workspace();
        let windows = activeWs.list_windows();
        if (Meta.prefs_get_workspaces_only_on_primary()) {
            windows = windows.filter(w => w.is_on_primary_monitor());
        } else {
              windows = windows.filter(w => !(w.is_on_all_workspaces() || w.is_above()));
        }
        const newFocus = windows.reduce((prev, current) => {
            if (current.get_user_time() > prev.get_user_time()) {
                return current;
            }
            return prev;
        });
        if (newFocus)
            console.log(newFocus.get_title(), newFocus.is_on_all_workspaces());
        else
            console.log("no window to focus");
        setTimeout(() => newFocus?.focus(global.get_current_time()), 1);
    }

    enable() {
        global.workspace_manager.connectObject(
            'active-workspace-changed', () => this._onActiveWorkspaceChanged(), GObject.ConnectFlags.AFTER,
            this);
    }

    disable() {
        global.workspace_manager.disconnectObject(this);
    }
}

function init() {
    return new Extension();
}
