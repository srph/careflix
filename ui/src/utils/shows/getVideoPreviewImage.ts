/**
 * If the video doesn't have a preview image, we'll fallback to the show's preview image.
 */
export default function getVideoPreviewImage(party: AppParty): string {
  return party.video.preview_image || party.video.show.preview_image
}