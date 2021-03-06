import React from 'react';
import TextField from '@material-ui/core/TextField';

/* user-defined offsets plus a move diagram */

function PieceCustomize(props) {
  /*
  (center is 150, 150)

  first row/column is 10
  second row/column is 30,
  ...
  last row/column is 290

  the offset o = 16x + y should give us x on the row and y on the column, i.e., (20x, 20y)
  (and x,y must be in [-7, +7]).

  the offset -23 = -16 + -7 should give us -1 on the row and -7 on the column, i.e., ( -20, -140)
  the offset -17 = -16 + -1 should give us -1 on the row and -1 on the column, i.e., ( -20,  -20)
  the offset -15 = -16 + +1 should give us -1 on the row and +1 on the column, i.e., ( -20,  +20)
  the offset  -7 =   0 + -7 should give us  0 on the row and -7 on the column, i.e., ( -20, +140)
  the offset 0 should give us no change in the row/column indexes, i.e., (0, 0)
  the offset  +7 =   0 + +7 should give us  0 on the row and +7 on the column, i.e., (   0, +140)
  the offset +15 = +16 + -1 should give us +1 on the row and -1 on the column, i.e., ( +20,  -20)
  the offset +17 = +16 + +1 should give us +1 on the row and +1 on the column, i.e., ( +20,  +20)
  */

  const circles = [];

  /* I want circles to look like this:
  [
    <circle key="5" className="move" cx="50" cy="10" r="6" />,
    <circle key="6" className="move" cx="30" cy="10" r="6" />,
    <circle key="7" className="move" cx="10" cy="10" r="6" />
  ]
  */

  let keyCount = 0;

  const {
    offsets, repeatOffsets, hideInput, onChangeOffsets, onChangeRepeatOffsets,
  } = props;
  offsets.forEach((offset) => {
    // calculate cx , cy from the given offset
    const cx = (10 + 20 * (offset + 119 & 15)) / 3;
    const cy = (10 + 20 * (offset + 119 >>> 4)) / 3;
    circles.push(<circle key={keyCount} className="move" cx={`${cx}%`} cy={`${cy}%`} r="2.5%" />);
    keyCount += 1;
  });

  repeatOffsets.forEach((offset) => {
    let cx; let
      cy;
    // determine how many repetitions (offset multiplications) until we hit the end of the board
    const reps = Math.floor(7 / Math.max(Math.abs(7 - (offset + 119 & 15)), Math.abs(7 - (offset + 119 >>> 4))));
    for (let i = 1; i <= reps; i += 1) {
      // calculate cx , cy from the given offset
      cx = (10 + 20 * (offset * i + 119 & 15)) / 3;
      cy = (10 + 20 * (offset * i + 119 >>> 4)) / 3;
      circles.push(<circle key={keyCount} className="moveRepeat" cx={`${cx}%`} cy={`${cy}%`} r="2.5%" />);
      keyCount += 1;
    }
  });

  return (
    <div className="piece-customize">
      { hideInput
        ? null : (
          <div className="move-input">
            <TextField
              label="Exact offsets"
              inputProps={{ 'data-testid': 'test-offset-input' }}
              helperText="Movement to an exact square"
              variant="outlined"
              onChange={onChangeOffsets}
            />
            <TextField
              label="Repeating offsets"
              helperText="Movement in a particular direction"
              variant="outlined"
              onChange={onChangeRepeatOffsets}
            />
          </div>
        )}
      <div className="move-diagram">
        <svg width="100%" height="100%">
          <rect x="48%" y="48%" width="4%" height="4%" />
          {circles}
        </svg>
      </div>
    </div>
  );
}

export default PieceCustomize;
