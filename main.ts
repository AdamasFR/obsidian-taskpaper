import { App, Plugin, PluginSettingTab, Setting } from 'obsidian';


interface MyPluginSettings {
	fileExtension: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	fileExtension: "taskpaper",
};

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "archive-taskpaper-command",
			name: "Archive @done lines in the current document",
			callback: () => {
				console.log("command triggered");
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TaskpaperSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);

		// register the view and extensions
		this.registerExtensions([this.settings.fileExtension], "markdown");
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class TaskpaperSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Taskpaper Support Settings" });

		new Setting(containerEl)
			.setName("Taskpaper File Extension")
			.setDesc("by default, it's *.taskpaper")
			.addText((text) =>
				text
					.setPlaceholder("*.taskpaper")
					.setValue(this.plugin.settings.fileExtension)
					.onChange(async (value) => {
						console.log("fileExtension: " + value);
						this.plugin.settings.fileExtension = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
