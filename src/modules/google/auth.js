import Fitness from '@ovalmoney/react-native-fitness';
import util from '../../utils/general'

const permissions = [
  { kind: Fitness.PermissionKinds.Distances, access: Fitness.PermissionAccesses.Read, },
  { kind: Fitness.PermissionKinds.HeartRate, access: Fitness.PermissionAccesses.Read, },
];

const checkAuthorized = () => {
  return Fitness.isAuthorized(permissions);
}

const authenticate =  () => {
  return Fitness.requestPermissions(permissions);
}

module.exports = {
  authenticate,
  checkAuthorized
}
