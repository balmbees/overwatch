import ComponentLoader from './components/loader';

const redashComponent =
  ComponentLoader.load(require('./database/components/redash.json'));

redashComponent.watch().then((watchResult) => {
  console.log(watchResult);
});
