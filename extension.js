const { Meta } = imports.gi;

class Extension {
    _onActiveWorkspaceChanged() {
        if (!Meta.prefs_get_workspaces_only_on_primary())
            return;

        const activeWs = global.workspace_manager.get_active_workspace();
        let windows = activeWs.list_windows()
              .filter(w => w.is_on_primary_monitor());
        const newFocus = windows.reduce((prev, current) => {
            if (current.get_user_time() > prev.get_user_time()) {
                return current;
            }
            return prev;
        });
        newFocus?.activate(global.get_current_time());
    }

    enable() {
        global.workspace_manager.connectObject(
            'active-workspace-changed', () => this._onActiveWorkspaceChanged(),
            this);
    }

    disable() {
        global.workspace_manager.disconnectObject(this);
    }
}

function init() {
    return new Extension();
}
