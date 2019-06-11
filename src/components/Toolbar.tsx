import React from 'react';

import { throttle } from 'throttle-debounce';

import { Image } from './Image'


export interface ToolbarProps {
  color: string;
  onColorChange: (color: string) => void;
  onCursorChange: (cursor: 'move' | 'text' | null) => void;
  onPrintClick: () => void;
}

export interface ToolbarState {
  color: string;
}

export class Toolbar extends React.Component<ToolbarProps, ToolbarState> {
  constructor(props: ToolbarProps) {
    super(props);

    this.state = {
      color: this.props.color,
    };
  }

  onColorChange = (e: any) => {
    this.setState({
      color: e.target.value,
    })
    this.onThrottledColorChange(e.target.value);
  }

  onThrottledColorChange = throttle(500, (color: string) => {
    this.props.onColorChange(color);
  });

  onCursorChange = (e: any, cursor: 'move' | 'text' | null) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.onCursorChange(cursor);
  }

  onDragStart = (e: any) => {
    e.dataTransfer.setData('action', 'text');
    e.dataTransfer.setData('data', JSON.stringify({}));
    e.dataTransfer.dropEffect = 'copy';
  }

  onPrintClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.onPrintClick();
  }

  onMoveClick = (e: any) => {
    this.onCursorChange(e, 'move');
  }

  onTextClick = (e: any) => {
    this.onCursorChange(e, 'text');
  }

  render() {
    return (
      <div className='toolbar'>
        <div><input type='color' value={this.state.color} onChange={this.onColorChange}/></div>
        
        <div style={{cursor: 'pointer'}} className='material-icons md-light' onClick={this.onPrintClick}>print</div>
        <div style={{cursor: 'pointer'}} className='material-icons md-light' onClick={this.onMoveClick}>zoom_out_map</div>
        <div draggable className='material-icons md-light' onDragStart={this.onDragStart} onClick={this.onTextClick}>title</div>
        
        <ToolbarIcon action='attack' />
        <ToolbarIcon action='heal' />
        <ToolbarIcon action='range' />
        <ToolbarIcon action='target' />
        <ToolbarIcon action='move' />
        <ToolbarIcon action='jump' />
        <ToolbarIcon action='flying' />
        <ToolbarIcon action='shield' />
        <ToolbarIcon action='retaliate' />
        <ToolbarIcon action='loot' />
        <ToolbarIcon action='xp' data={{
          nodes: [{
            object: 'text',
            text: '1',
          }],
        }} />
        <ToolbarIcon action='round' />
        <ToolbarIcon action='persistent' />
        <ToolbarIcon action='element-all' />
        <ToolbarIcon action='element-fire' />
        <ToolbarIcon action='element-ice' />
        <ToolbarIcon action='element-air' />
        <ToolbarIcon action='element-earth' />
        <ToolbarIcon action='element-light' />
        <ToolbarIcon action='element-dark' />

        <ToolbarIcon action='effect-add-target' />
        <ToolbarIcon action='effect-push' />
        <ToolbarIcon action='effect-pull' />
        <ToolbarIcon action='effect-pierce' />

        <ToolbarIcon action='status-poison' />
        <ToolbarIcon action='status-wound' />
        <ToolbarIcon action='status-immobilize' />
        <ToolbarIcon action='status-disarm' />
        <ToolbarIcon action='status-stun' />
        <ToolbarIcon action='status-muddle' />
        <ToolbarIcon action='curse' />

        <ToolbarIcon action='status-invisible' />
        <ToolbarIcon action='status-strengthen' />
        <ToolbarIcon action='bless' />
        <ToolbarIcon action='card-lost' />
        <ToolbarIcon action='card-recover' />
        <ToolbarIcon action='card-unrecoverable' />
      </div>
    );
  }
}

export interface ToolbarIconProps {
  action: string;
  icon?: any;
  data?: object;
}

export const ToolbarIcon: React.FC<ToolbarIconProps> = (props) => {
  let onDragStart = (e: any) => {
    e.dataTransfer.setData('action', props.action);
    e.dataTransfer.setData('data', JSON.stringify(props.data || {}));
    e.dataTransfer.dropEffect = 'copy';
  };

  return (
    <div draggable>
      <Image alt={props.icon} src={props.icon || require(`../assets/${props.action}.png`)} onDragStart={onDragStart}/>
    </div>
  );
}
