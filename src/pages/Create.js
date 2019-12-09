import React from 'react';
import Board from '../WithMoveValidation';
import SparePieces from '../components/customization/SparePieces.js';
import PieceCustomize from '../components/customization/PieceCustomize.js';
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import './Create.css';

/* /create page that contains
(a) the board in edit mode,
(b) spare pieces that can be added to the board,
(c) customization,
*/

class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: true,
      icon: 'cursor',
      offsets: [],
      repeatOffsets: []
    };
    this.handleIconChange = this.handleIconChange.bind(this);
    this.handleRepeatOffsetsChange = this.handleRepeatOffsetsChange.bind(this);
    this.handleOffsetsChange = this.handleOffsetsChange.bind(this);
  }

  handleIconChange(event) {
    this.setState({
      icon: event.target.value
    });
  };

  handleOffsetsChange(event) {
    // separate input into list of numbers (separation criterion: any number of spaces/commas/semicolons); e.g.,
    // '1 2 , -3,4' -> [ 1, 2, -3, 4 ]
    const offsets = (event.target.value).split(/[\s,;]+/).map(Number);
    // remove everything from the list except for numbers that are valid offsets
    const filtered = offsets.filter(offset => offset && offset >= -119 && offset <= 119 && offset !== 0);
    this.setState({
      offsets: filtered
    });
  }

  handleRepeatOffsetsChange(event) {
    const offsets = (event.target.value).split(/[\s,;]+/).map(Number);
    const filtered = offsets.filter(offset => offset && offset >= -119 && offset <= 119 && offset !== 0);
    this.setState({
      repeatOffsets: filtered
    });
  }

  customPiece() {
    return { 'c': { '0': this.state.offsets, '1': this.state.repeatOffsets } };
  }

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <div id='board' style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', position: 'relative', }}>
          {/* render the board */}
          <div>
            {Board('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 0, false, false, this.state.editMode, this.state.icon, this.customPiece())}
            <div style={{ textAlign: 'left', padding: '0.75em', backgroundColor: '#d3d3d6', border: '0.2em solid black' }}>
              <TextField defaultValue="Untitled" label="Name"></TextField><br/>
              <TextField disabled label="Exact offsets" value={this.state.offsets}></TextField><br/>
              <TextField disabled label="Repeating offsets" value={this.state.repeatOffsets}></TextField><br/>
              <br/>
              <Button variant="contained" color="primary" onClick={() => {}}>Save as variant</Button>
            </div>
          </div>
          {/* render controlled inputs */}
          <div>
            <SparePieces handleChange={this.handleIconChange} />
            <div><a href="/pieces">View current fairy pieces</a></div>
            <div><a href="/tutorial">View the customization tutorial</a></div>
            <PieceCustomize
              offsets={this.state.offsets}
              repeatOffsets={this.state.repeatOffsets}
              onChangeOffsets={this.handleOffsetsChange}
              onChangeRepeatOffsets={this.handleRepeatOffsetsChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Create;