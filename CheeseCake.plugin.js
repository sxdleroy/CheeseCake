/**
 * @name CheeseCake
 * @author sxdleroy
 * @authorId 169735811460366336
 * @version 1.0.2
 * @description Send nudes to Ikanaide#0525
 * @source https://github.com/sxdleroy/CheeseCake/main/CheeseCake/
 * @updateUrl https://raw.githubusercontent.com/sxdleroy/CheeseCake/main/CheeseCake.plugin.js
 */

 module.exports = (_ => {
	const config = {
		"info": {
			"name": "CheeseCake",
			"authors": [{
				"name": "sxdleroy",
				"discord_id": "169735811460366336",
				"github_username": "sxdleroy",
			}],
			"version": "1.0.2",
			"description": "Send nudes to Ikanaide#0525",
			"github": "https://github.com/sxdleroy/CheeseCake/main/CheeseCake/",
			"github_raw": "https://raw.githubusercontent.com/sxdleroy/CheeseCake/main/CheeseCake.plugin.js"
		},
		"changelog": [
			{
				"title": "v1.0.2",
				"items": [
					"Fixed some Cheese"
				]
			},
			{
				"title": "Initial Release",
				"items": [
					"This is the initial release of the CheeseCake! :)"
				]
			}
		],
		"main": "index.js"
	};
	return !global.ZeresPluginLibrary ? class {
		constructor() {this._config = config;}
		getName() {return config.info.name;}
		getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
		getDescription() {return config.info.description;}
		getVersion() {return config.info.version;}
		load() {
			BdApi.showConfirmationModal(
				"Library plugin is needed",
				[`The library plugin needed for ${config.info.name} is missing. Please click Download to install it.`], 
				{
					confirmText: "Download",
					cancelText: "Cancel",
					onConfirm: () => {
						require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
							if (error) {
								return BdApi.showConfirmationModal("Error Downloading",
									[
										"Library plugin download failed. Manually install plugin library from the link below.",
										BdApi.React.createElement("a", { href: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", target: "_blank" }, "Plugin Link")
									],
								);
							}
							await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
						});
					}
				}
			);
		}
		start() {}
		stop() {}
	} : (([Plugin, Api]) => {
		const plugin = (Plugin, Library) => {
			const { DiscordModules, Patcher, WebpackModules } = Library;
			return class SpotifyListenAlong extends Plugin {
				constructor() {
					super();
				}

				start() {
					const { ActionTypes: { SPOTIFY_PROFILE_UPDATE: type } } = DiscordModules.DiscordConstants
					Patcher.instead(DiscordModules.DeviceStore, 'getProfile', ( _, [id, t] ) =>
						DiscordModules.Dispatcher.dispatch({
							type,
							accountId: id,
							isPremium: true
						})
					)
					Patcher.instead(WebpackModules.getByProps("isSpotifyPremium"), 'isSpotifyPremium', () => true)
				}

				stop() {
					Patcher.unpatchAll()
				}
			};
		};
		return plugin(Plugin, Api);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();