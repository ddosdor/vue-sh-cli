import * as fs from 'fs';
import * as config from './vshclirc-default';


interface IConfig {
  directories: object,
  settings: object
}

class Config {
  config: any;
  isExternalConfigFileExists: boolean = fs.existsSync('./.vshclirc.json');
  necessaryKeys: string[] | any = ['directories', 'settings'];

  public async getExternalConfig(): Promise<void> {
    try {
      if (this.isExternalConfigFileExists) {
        const _config_ = await fs.readFileSync('./.vshclirc.json', 'utf8');
        this.config = JSON.parse(`${_config_}`);
      } else {
        this.config = config.default;
      }
    } catch(err) {
      this.config = config.default;
    }
  }

  public validateNecessaryKeysInExternalConfigFile(configFile): IConfig {
    const _keys_: string[] | any = Object.keys(configFile);
    let _config_ = configFile;
    if (this.isExternalConfigFileExists) {
      this.necessaryKeys.forEach(key => {
        if (!_keys_.includes(key)) {
          _config_[key] = config.default[key];
        };
      });
    };
    return _config_;
  }

  public exportConfig() {
    return this.validateNecessaryKeysInExternalConfigFile(this.config);
  }
}

export default ( async (): Promise<any> => {
  const config = new Config();
  await config.getExternalConfig();
  return config.exportConfig();
})()