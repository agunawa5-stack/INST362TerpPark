
export function getParkingStatus(lot, userPermit) {
  // We can't determine status if the user doesn't have a permit
  if (!userPermit) {
    return "unknown";
  }

  // The lot must have parking rule information
  if (!Array.isArray(lot.allowedPermits)) {
    return "unknown";
  }

  // Check whether the permit is accepted
  if (lot.allowedPermits.includes(userPermit)) {
    return "allowed";
  }

  return "restricted";
}
