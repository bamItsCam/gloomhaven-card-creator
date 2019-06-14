import { Editor } from 'slate-react'
import { Inline } from 'slate'

import React from 'react'
import ReactDOM from 'react-dom'


export const Button = React.forwardRef<React.Ref<any>, any>(({ style, active, reversed, ...props }, ref) => (
    <span
      {...props}
      ref={ref}
      style={{
        ...style,
        cursor: 'pointer',
        color: `${reversed ? active ? 'white' : '#aaa' : active ? 'black' : '#ccc'}`,
      }}
    />
  )
)

export const Icon = React.forwardRef<React.Ref<any>, any>(({ className, style, ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    className={[
      ...(className || '').split(' '),
      'material-icons',
    ].join(' ')}
    style={{
      ...style,
      fontSize: '18px',
      verticalAlign: 'text-bottom',
    }}
  />
))

export const Menu = React.forwardRef<React.Ref<any>, any>((props, ref) => (
  <div
    {...props}
    ref={ref}
  />
))

const FontSizeValueButton = ({ editor }) => {
  const block = editor.value.anchorBlock
  const blockData = (block && block.data) || new Map<string, any>()

  return (
    <span style={{color: 'white', padding: '0 4px', textAlign: 'center', minWidth: '2ems'}}>
      {blockData.get('fontSize') || 18}pt
    </span>
  )
}

const FontSizeButton = ({ editor, type }) => {
  const { value } = editor
  const block = value.anchorBlock && (value.anchorBlock.toJSON() || {})
  const isActive = block && block.type === 'action-main'

  return (
    <Button
      reversed
      active={isActive}
      onMouseDown={event => {
        event.preventDefault()

        editor.setBlocks({
          ...block,
          data: {
            ...block.data,
            fontSize: (block.data.fontSize || 18) + (type === 'add' ? 1 : -1),
          }
        })
      }}
    >
      <Icon>{`${type}_circle`}</Icon>
    </Button>
  )
}

const AlignButton = ({ editor, align }) => {
  const { value } = editor
  const block = value.anchorBlock && (value.anchorBlock.toJSON() || {})
  const isActive = block && block.type === 'action-main' && (block.data.align || 'center') === align

  return (
    <Button
      reversed
      active={isActive}
      onMouseDown={event => {
        event.preventDefault()

        editor.setBlocks({
          ...block,
          data: {
            ...block.data,
            align: align,
          }
        })
      }}
    >
      <Icon>{`format_align_${align}`}</Icon>
    </Button>
  )
}

const IconOnlyButton = ({ editor }) => {
  const { value } = editor

  const { document, selection } = value
  const { focus } = selection
  if (!selection.isCollapsed) return null

  const node = focus.path && document.getParent(focus.path)
  if (!Inline.isInline(node) || !['action', 'element'].includes(node.type)) return null

  const inline = (node.toJSON() || {}) as any
  const isActive = !inline.data.iconOnly

  return (
    <Button
      reversed
      active={isActive}
      onMouseDown={event => {
        event.preventDefault()

        editor.setInlines({
          ...inline,
          data: {
            ...inline.data,
            iconOnly: !inline.data.iconOnly,
          }
        })
      }}
    >
      <Icon>title</Icon>
    </Button>
  )
}

const ConsumeButton = ({ editor }) => {
  const { value } = editor

  const { document, selection } = value
  const { focus } = selection
  if (!selection.isCollapsed) return null

  const node = focus.path && document.getParent(focus.path)
  if (!Inline.isInline(node) || !['element'].includes(node.type)) return null

  const inline = (node.toJSON() || {}) as any
  const isActive = !inline.data.consume

  return (
    <Button
      reversed
      active={isActive}
      onMouseDown={event => {
        event.preventDefault()

        editor.setInlines({
          ...inline,
          data: {
            ...inline.data,
            consume: !inline.data.consume,
          }
        })
      }}
    >
      <img src={require('../assets/consume-element.png')} style={{width: '1em', height: 'auto'}}/>
    </Button>
  )
}

export const HoverMenu = React.forwardRef<React.Ref<any>, {editor: Editor}>((props, ref) => {
  const root = window.document.getElementById('root')
  if (!root) return null

  return ReactDOM.createPortal(
    <Menu
      ref={ref}
      className='hover-menu'
    >
      <FontSizeButton editor={props.editor} type='remove' />
      <FontSizeValueButton editor={props.editor} />
      <FontSizeButton editor={props.editor} type='add' />
      <AlignButton editor={props.editor} align='left' />
      <AlignButton editor={props.editor} align='center' />
      <AlignButton editor={props.editor} align='right' />

      <IconOnlyButton editor={props.editor} />
      <ConsumeButton editor={props.editor} />
    </Menu>,
    root
  )
})
