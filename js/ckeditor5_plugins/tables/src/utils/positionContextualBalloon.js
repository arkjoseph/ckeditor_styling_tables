import {
  getSelectionAffectedTable
} from '@ckeditor/ckeditor5-table/src/utils/common';
import { BalloonPanelView } from 'ckeditor5/src/ui';
const DEFAULT_BALLOON_POSITIONS = BalloonPanelView.defaultPositions;
const BALLOON_POSITIONS = [
  DEFAULT_BALLOON_POSITIONS.northArrowSouth,
  DEFAULT_BALLOON_POSITIONS.northArrowSouthWest,
  DEFAULT_BALLOON_POSITIONS.northArrowSouthEast,
  DEFAULT_BALLOON_POSITIONS.southArrowNorth,
  DEFAULT_BALLOON_POSITIONS.southArrowNorthWest,
  DEFAULT_BALLOON_POSITIONS.southArrowNorthEast,
  DEFAULT_BALLOON_POSITIONS.viewportStickyNorth
];
/**
 * A helper utility that positions the
 * {@link module:ui/panel/balloon/contextualballoon~ContextualBalloon contextual balloon} instance
 * with respect to the table in the editor content, if one is selected.
 *
 * @param editor The editor instance.
 * @param target Either "cell" or "table". Determines the target the balloon will be attached to.
 */
export function repositionContextualBalloon(editor, target) {
  const balloon = editor.plugins.get('ContextualBalloon');
  const selection = editor.editing.view.document.selection;
  let position;
  //if (getSelectionAffectedTableWidget(selection)) {
    position = getBalloonTablePositionData(editor);
  //}
  if (position) {
    balloon.updatePosition(position);
  }
}

/**
 * Returns the positioning options that control the geometry of the
 * {@link module:ui/panel/balloon/contextualballoon~ContextualBalloon contextual balloon} with respect
 * to the selected table in the editor content.
 *
 * @param editor The editor instance.
 */
export function getBalloonTablePositionData(editor) {
  const selection = editor.model.document.selection;
  const modelTable = getSelectionAffectedTable(selection);
  const viewTable = editor.editing.mapper.toViewElement(modelTable);
  return {
    target: editor.editing.view.domConverter.mapViewToDom(viewTable),
    positions: BALLOON_POSITIONS
  };
}
