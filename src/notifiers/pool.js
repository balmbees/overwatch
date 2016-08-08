import NotifierLoader from './loader';

const notifiers = {};

export default function getNotifier(notifierSettings) {
  if (!(notifierSettings.name in notifiers)) {
    notifiers[notifierSettings.name] = NotifierLoader.load(notifierSettings);
  }
  return notifiers[notifierSettings.name];
}
