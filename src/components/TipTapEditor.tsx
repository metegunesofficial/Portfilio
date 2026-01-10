import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Typography from '@tiptap/extension-typography'
import { useState, useCallback } from 'react'
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    List, ListOrdered, Quote, Code,
    Heading1, Heading2, Heading3, Pilcrow,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Image as ImageIcon, Link as LinkIcon, Minus,
    Table as TableIcon, Undo, Redo, Palette, Highlighter,
    Subscript as SubIcon, Superscript as SupIcon, Trash2,
    Plus, Minus as MinusIcon, RowsIcon, ColumnsIcon
} from 'lucide-react'

interface TipTapEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
}

const COLORS = [
    '#000000', '#434343', '#666666', '#999999', '#cccccc',
    '#e60000', '#ff9900', '#ffff00', '#00ff00', '#00ffff',
    '#0000ff', '#9900ff', '#ff00ff', '#ffa07a', '#98fb98',
]

const HIGHLIGHT_COLORS = [
    '#ffff00', '#00ff00', '#00ffff', '#ff00ff', '#ffa500',
    '#ff69b4', '#98fb98', '#87ceeb', '#dda0dd', '#f0e68c',
]

export function TipTapEditor({ content, onChange, placeholder = 'İçeriğinizi yazın...' }: TipTapEditorProps) {
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [showHighlightPicker, setShowHighlightPicker] = useState(false)
    const [showLinkInput, setShowLinkInput] = useState(false)
    const [linkUrl, setLinkUrl] = useState('')

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Placeholder.configure({ placeholder }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Underline,
            TextStyle,
            Color,
            Highlight.configure({
                multicolor: true,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'editor-link' },
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableCell,
            TableHeader,
            Subscript,
            Superscript,
            HorizontalRule,
            Typography,
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    const addImage = useCallback(() => {
        const url = prompt('Resim URL\'si girin:')
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }, [editor])

    const addLink = useCallback(() => {
        if (linkUrl && editor) {
            editor.chain().focus().setLink({ href: linkUrl }).run()
            setLinkUrl('')
            setShowLinkInput(false)
        }
    }, [editor, linkUrl])

    const removeLink = useCallback(() => {
        if (editor) {
            editor.chain().focus().unsetLink().run()
        }
    }, [editor])

    const insertTable = useCallback(() => {
        if (editor) {
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
    }, [editor])

    if (!editor) return null

    return (
        <div className="tiptap-editor advanced">
            {/* Main Toolbar */}
            <div className="tiptap-toolbar">
                {/* Text Formatting */}
                <div className="toolbar-group">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive('bold') ? 'active' : ''}
                        title="Kalın (Ctrl+B)"
                    >
                        <Bold size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive('italic') ? 'active' : ''}
                        title="İtalik (Ctrl+I)"
                    >
                        <Italic size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={editor.isActive('underline') ? 'active' : ''}
                        title="Altı Çizili (Ctrl+U)"
                    >
                        <UnderlineIcon size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={editor.isActive('strike') ? 'active' : ''}
                        title="Üstü Çizili"
                    >
                        <Strikethrough size={16} />
                    </button>
                </div>

                <div className="toolbar-divider" />

                {/* Headings */}
                <div className="toolbar-group">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setParagraph().run()}
                        className={editor.isActive('paragraph') ? 'active' : ''}
                        title="Paragraf"
                    >
                        <Pilcrow size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}
                        title="Başlık 1"
                    >
                        <Heading1 size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
                        title="Başlık 2"
                    >
                        <Heading2 size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}
                        title="Başlık 3"
                    >
                        <Heading3 size={16} />
                    </button>
                </div>

                <div className="toolbar-divider" />

                {/* Text Alignment */}
                <div className="toolbar-group">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className={editor.isActive({ textAlign: 'left' }) ? 'active' : ''}
                        title="Sola Hizala"
                    >
                        <AlignLeft size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className={editor.isActive({ textAlign: 'center' }) ? 'active' : ''}
                        title="Ortala"
                    >
                        <AlignCenter size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        className={editor.isActive({ textAlign: 'right' }) ? 'active' : ''}
                        title="Sağa Hizala"
                    >
                        <AlignRight size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        className={editor.isActive({ textAlign: 'justify' }) ? 'active' : ''}
                        title="İki Yana Yasla"
                    >
                        <AlignJustify size={16} />
                    </button>
                </div>

                <div className="toolbar-divider" />

                {/* Lists */}
                <div className="toolbar-group">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={editor.isActive('bulletList') ? 'active' : ''}
                        title="Madde İşaretli Liste"
                    >
                        <List size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={editor.isActive('orderedList') ? 'active' : ''}
                        title="Numaralı Liste"
                    >
                        <ListOrdered size={16} />
                    </button>
                </div>

                <div className="toolbar-divider" />

                {/* Colors */}
                <div className="toolbar-group color-group">
                    <div className="color-picker-wrapper">
                        <button
                            type="button"
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            className={showColorPicker ? 'active' : ''}
                            title="Metin Rengi"
                        >
                            <Palette size={16} />
                        </button>
                        {showColorPicker && (
                            <div className="color-picker-dropdown">
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className="color-swatch"
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                            editor.chain().focus().setColor(color).run()
                                            setShowColorPicker(false)
                                        }}
                                    />
                                ))}
                                <button
                                    type="button"
                                    className="color-reset"
                                    onClick={() => {
                                        editor.chain().focus().unsetColor().run()
                                        setShowColorPicker(false)
                                    }}
                                >
                                    Sıfırla
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="color-picker-wrapper">
                        <button
                            type="button"
                            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
                            className={editor.isActive('highlight') ? 'active' : ''}
                            title="Vurgulama"
                        >
                            <Highlighter size={16} />
                        </button>
                        {showHighlightPicker && (
                            <div className="color-picker-dropdown">
                                {HIGHLIGHT_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className="color-swatch"
                                        style={{ backgroundColor: color }}
                                        onClick={() => {
                                            editor.chain().focus().toggleHighlight({ color }).run()
                                            setShowHighlightPicker(false)
                                        }}
                                    />
                                ))}
                                <button
                                    type="button"
                                    className="color-reset"
                                    onClick={() => {
                                        editor.chain().focus().unsetHighlight().run()
                                        setShowHighlightPicker(false)
                                    }}
                                >
                                    Kaldır
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="toolbar-divider" />

                {/* Insert */}
                <div className="toolbar-group">
                    <div className="link-wrapper">
                        <button
                            type="button"
                            onClick={() => setShowLinkInput(!showLinkInput)}
                            className={editor.isActive('link') ? 'active' : ''}
                            title="Link Ekle"
                        >
                            <LinkIcon size={16} />
                        </button>
                        {showLinkInput && (
                            <div className="link-input-dropdown">
                                <input
                                    type="url"
                                    placeholder="https://..."
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addLink()}
                                />
                                <button type="button" onClick={addLink}>Ekle</button>
                                {editor.isActive('link') && (
                                    <button type="button" onClick={removeLink} className="remove-btn">
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={addImage}
                        title="Resim Ekle"
                    >
                        <ImageIcon size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={insertTable}
                        title="Tablo Ekle"
                    >
                        <TableIcon size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        title="Yatay Çizgi"
                    >
                        <Minus size={16} />
                    </button>
                </div>

                <div className="toolbar-divider" />

                {/* Extra Formatting */}
                <div className="toolbar-group">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={editor.isActive('blockquote') ? 'active' : ''}
                        title="Alıntı"
                    >
                        <Quote size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={editor.isActive('codeBlock') ? 'active' : ''}
                        title="Kod Bloğu"
                    >
                        <Code size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleSubscript().run()}
                        className={editor.isActive('subscript') ? 'active' : ''}
                        title="Alt Simge"
                    >
                        <SubIcon size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleSuperscript().run()}
                        className={editor.isActive('superscript') ? 'active' : ''}
                        title="Üst Simge"
                    >
                        <SupIcon size={16} />
                    </button>
                </div>

                <div className="toolbar-divider" />

                {/* Undo/Redo */}
                <div className="toolbar-group">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Geri Al (Ctrl+Z)"
                    >
                        <Undo size={16} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Yinele (Ctrl+Y)"
                    >
                        <Redo size={16} />
                    </button>
                </div>
            </div>

            {/* Table Controls (shown when table is selected) */}
            {editor.isActive('table') && (
                <div className="tiptap-toolbar table-controls">
                    <div className="toolbar-group">
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().addRowBefore().run()}
                            title="Üste Satır Ekle"
                        >
                            <RowsIcon size={14} />
                            <Plus size={10} />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().addRowAfter().run()}
                            title="Alta Satır Ekle"
                        >
                            <RowsIcon size={14} />
                            <Plus size={10} />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().deleteRow().run()}
                            title="Satır Sil"
                        >
                            <RowsIcon size={14} />
                            <MinusIcon size={10} />
                        </button>
                    </div>
                    <div className="toolbar-divider" />
                    <div className="toolbar-group">
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().addColumnBefore().run()}
                            title="Sola Sütun Ekle"
                        >
                            <ColumnsIcon size={14} />
                            <Plus size={10} />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().addColumnAfter().run()}
                            title="Sağa Sütun Ekle"
                        >
                            <ColumnsIcon size={14} />
                            <Plus size={10} />
                        </button>
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().deleteColumn().run()}
                            title="Sütun Sil"
                        >
                            <ColumnsIcon size={14} />
                            <MinusIcon size={10} />
                        </button>
                    </div>
                    <div className="toolbar-divider" />
                    <div className="toolbar-group">
                        <button
                            type="button"
                            onClick={() => editor.chain().focus().deleteTable().run()}
                            className="delete-btn"
                            title="Tabloyu Sil"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* Editor Content */}
            <EditorContent editor={editor} className="tiptap-content" />
        </div>
    )
}
