<script>
	import { onMount, onDestroy } from 'svelte';
	import { EditorState } from 'prosemirror-state';
	import { EditorView } from 'prosemirror-view';
	import { schema } from 'prosemirror-markdown';
	import { exampleSetup } from 'prosemirror-example-setup';
	import { defaultMarkdownParser, defaultMarkdownSerializer } from 'prosemirror-markdown';
	import { toggleMark } from 'prosemirror-commands';
	import { setBlockType } from 'prosemirror-commands';
	import { wrapIn } from 'prosemirror-commands';
	import { lift } from 'prosemirror-commands';
	import { undo, redo } from 'prosemirror-history';
	import {
		Undo2,
		Redo2,
		Bold,
		Italic,
		Type,
		Heading1,
		Heading2,
		Heading3,
		List,
		ListOrdered,
		Quote,
		Code,
		Link,
		Minus
	} from 'lucide-svelte';
	import { browser } from '$app/environment';

	/** @type {string} */
	export let value = '';
	/** @type {(val: string) => void} */
	export let onInput = () => {};
	/** @type {string} */
	export let id = 'markdown-prosemirror';
	/** @type {string} */
	export let placeholder = 'Enter markdown content...';

	/** @type {HTMLDivElement} */
	let editorDiv;
	/** @type {EditorView} */
	let view;
	/** @type {boolean} */
	let showCodeDropdown = false;
	/** @type {boolean} */
	let showHeadingDropdown = false;

	function createEditorState(content = '') {
		return EditorState.create({
			doc: content ? defaultMarkdownParser.parse(content) : undefined,
			schema,
			plugins: exampleSetup({ schema, menuBar: false }) // Disable built-in menubar
		});
	}

	function updateMarkdown() {
		if (!view) return;
		const doc = view.state.doc;
		const markdown = defaultMarkdownSerializer.serialize(doc);
		onInput(markdown);
	}

	/** @type {(command: any) => void} */
	function applyCommand(command) {
		if (!view) return;
		const { state, dispatch } = view;
		if (command(state, dispatch)) {
			view.focus();
		}
	}

	function toggleBold() {
		applyCommand(toggleMark(schema.marks.strong));
	}

	function toggleItalic() {
		applyCommand(toggleMark(schema.marks.em));
	}

	function toggleCode() {
		applyCommand(toggleMark(schema.marks.code));
	}

	function toggleLink() {
		const url = prompt('Enter URL:');
		if (url) {
			applyCommand(toggleMark(schema.marks.link, { href: url }));
		}
	}

	/** @type {(level: number) => void} */
	function makeHeading(level) {
		applyCommand(setBlockType(schema.nodes.heading, { level }));
	}

	function makeParagraph() {
		applyCommand(setBlockType(schema.nodes.paragraph));
	}

	function makeBulletList() {
		applyCommand(wrapIn(schema.nodes.bullet_list));
	}

	function makeOrderedList() {
		applyCommand(wrapIn(schema.nodes.ordered_list));
	}

	function makeBlockquote() {
		applyCommand(wrapIn(schema.nodes.blockquote));
	}

	function makeCodeBlock() {
		applyCommand(setBlockType(schema.nodes.code_block));
	}

	function insertHorizontalRule() {
		if (!view) return;
		const { state, dispatch } = view;
		const hr = schema.nodes.horizontal_rule;
		if (hr) {
			const { tr } = state;
			tr.replaceSelectionWith(hr.create());
			dispatch(tr);
			view.focus();
		}
	}

	function liftList() {
		applyCommand(lift);
	}

	function undoAction() {
		applyCommand(undo);
	}

	function redoAction() {
		applyCommand(redo);
	}

	function toggleCodeDropdown() {
		showCodeDropdown = !showCodeDropdown;
		showHeadingDropdown = false;
	}

	function toggleHeadingDropdown() {
		showHeadingDropdown = !showHeadingDropdown;
		showCodeDropdown = false;
	}

	function closeDropdowns() {
		showCodeDropdown = false;
		showHeadingDropdown = false;
	}

	// Close dropdowns when clicking outside
	/** @type {(event: any) => void} */
	function handleClickOutside(event) {
		if (!event.target.closest('.dropdown-container')) {
			closeDropdowns();
		}
	}

	/** @type {(view: EditorView, event: ClipboardEvent) => boolean} */
	function handlePaste(view, event) {
		const text = event.clipboardData?.getData('text/plain');
		if (!text) return false;

		// Check if the pasted text looks like markdown
		const markdownPatterns = [
			/^#+\s+/m, // Headers
			/\*\*.*?\*\*/, // Bold
			/\*.*?\*/, // Italic
			/\[.*?\]\(.*?\)/, // Links
			/```[\s\S]*?```/, // Code blocks
			/^\s*[-*+]\s+/m, // Unordered lists
			/^\s*\d+\.\s+/m, // Ordered lists
			/^\s*>\s+/m, // Blockquotes
			/^---+\s*$/m // Horizontal rules
		];

		// Count how many markdown patterns are found
		const patternMatches = markdownPatterns.filter((pattern) => pattern.test(text));

		// Determine if it's markdown based on pattern matches
		// Require at least 2 patterns for high confidence, or 1 strong pattern
		const strongPatterns = [/^#+\s+/m, /```[\s\S]*?```/, /^\s*[-*+]\s+/m, /^\s*\d+\.\s+/m];
		const hasStrongPattern = strongPatterns.some((pattern) => pattern.test(text));
		const isMarkdown =
			patternMatches.length >= 2 || (patternMatches.length >= 1 && hasStrongPattern);

		if (isMarkdown) {
			// console.log('Markdown detected in paste:', {
			// 	patternMatches: patternMatches.length,
			// 	hasStrongPattern,
			// 	textPreview: text.substring(0, 100) + (text.length > 100 ? '...' : '')
			// });

			event.preventDefault();

			try {
				// Parse the markdown content
				const parsedDoc = defaultMarkdownParser.parse(text);

				// Replace the current selection with the parsed content
				const { state, dispatch } = view;
				const { tr } = state;

				// Convert the parsed document to a slice and replace the selection
				const slice = parsedDoc.slice(0, parsedDoc.content.size);
				tr.replaceSelection(slice);
				dispatch(tr);

				console.log('Successfully parsed and inserted markdown content');
				return true;
			} catch (error) {
				console.warn('Failed to parse pasted markdown:', error);
				// Fall back to default paste behavior
				return false;
			}
		}

		return false;
	}

	onMount(() => {
		if (!browser || !editorDiv) return;

		// Create the main editor state
		const editorState = createEditorState(value);

		view = new EditorView(editorDiv, {
			state: editorState,
			dispatchTransaction(tr) {
				if (!view) return;
				const newState = view.state.apply(tr);
				view.updateState(newState);
				updateMarkdown();
			},
			handlePaste: handlePaste
		});

		// Add click outside handler
		document.addEventListener('click', handleClickOutside);
	});

	onDestroy(() => {
		if (!browser) return;
		
		if (view) {
			view.destroy();
		}
		// Remove click outside handler
		document.removeEventListener('click', handleClickOutside);
	});

	// Update editor if value changes externally
	$: if (browser && view && value !== defaultMarkdownSerializer.serialize(view.state.doc)) {
		const state = createEditorState(value);
		view.updateState(state);
	}
</script>

<div class="rounded-lg border bg-white shadow-sm">
	<div class="flex items-center gap-2 border-b bg-gray-50 px-3 py-2">
		<div class="flex items-center gap-1">
			<!-- Undo/Redo -->
			<button class="toolbar-button" on:click={undoAction} title="Undo (Ctrl+Z)">
				<Undo2 size={16} />
			</button>
			<button class="toolbar-button" on:click={redoAction} title="Redo (Ctrl+Y)">
				<Redo2 size={16} />
			</button>

			<div class="mx-1 h-4 w-px bg-gray-300"></div>

			<!-- Text formatting -->
			<button class="toolbar-button" on:click={toggleBold} title="Bold (Ctrl+B)">
				<Bold size={16} />
			</button>
			<button class="toolbar-button" on:click={toggleItalic} title="Italic (Ctrl+I)">
				<Italic size={16} />
			</button>

			<div class="mx-1 h-4 w-px bg-gray-300"></div>

			<!-- Type Dropdown -->
			<div class="dropdown-container relative">
				<button class="toolbar-button" on:click={toggleCodeDropdown} title="Type Options">
					<Type size={16} />
				</button>
				{#if showCodeDropdown}
					<div class="dropdown-menu">
						<button
							class="dropdown-item"
							on:click={() => {
								toggleCode();
								closeDropdowns();
							}}
						>
							<Code size={14} class="mr-2" />
							Inline Code
						</button>
						<button
							class="dropdown-item"
							on:click={() => {
								makeCodeBlock();
								closeDropdowns();
							}}
						>
							<Code size={14} class="mr-2" />
							Code Block
						</button>
						<button
							class="dropdown-item"
							on:click={() => {
								toggleLink();
								closeDropdowns();
							}}
						>
							<Link size={14} class="mr-2" />
							Link
						</button>
					</div>
				{/if}
			</div>

			<!-- Heading Dropdown -->
			<div class="dropdown-container relative">
				<button class="toolbar-button" on:click={toggleHeadingDropdown} title="Heading Options">
					<Heading1 size={16} />
				</button>
				{#if showHeadingDropdown}
					<div class="dropdown-menu">
						<button
							class="dropdown-item"
							on:click={() => {
								makeHeading(1);
								closeDropdowns();
							}}
						>
							<Heading1 size={14} class="mr-2" />
							Heading 1
						</button>
						<button
							class="dropdown-item"
							on:click={() => {
								makeHeading(2);
								closeDropdowns();
							}}
						>
							<Heading2 size={14} class="mr-2" />
							Heading 2
						</button>
						<button
							class="dropdown-item"
							on:click={() => {
								makeHeading(3);
								closeDropdowns();
							}}
						>
							<Heading3 size={14} class="mr-2" />
							Heading 3
						</button>
					</div>
				{/if}
			</div>

			<div class="mx-1 h-4 w-px bg-gray-300"></div>

			<!-- Block types -->

			<button class="toolbar-button" on:click={makeBulletList} title="Bullet List">
				<List size={18} />
			</button>
			<button class="toolbar-button" on:click={makeOrderedList} title="Numbered List">
				<ListOrdered size={18} />
			</button>
			<button class="toolbar-button" on:click={makeBlockquote} title="Blockquote">
				<Quote size={12} />
			</button>
			<button class="toolbar-button" on:click={insertHorizontalRule} title="Horizontal Rule">
				<Minus size={16} />
			</button>
		</div>
	</div>

	<div
		bind:this={editorDiv}
		{id}
		class="prose prose-sm prose-editor relative min-h-[120px] w-full max-w-none p-3 focus:outline-none"
		style="background: white;"
	>
		{#if !value}
			<div class="placeholder-text">
				{placeholder}
			</div>
		{/if}
	</div>

	<div class="flex items-center justify-between border-t bg-gray-50 px-3 py-2">
		<span class="text-xs text-gray-500"> Markdown Editor </span>
	</div>
</div>

<style>
	.prose-editor :global(.ProseMirror) {
		outline: none;
		min-height: 120px;
		font-family: inherit;
		font-size: inherit;
		line-height: inherit;
	}

	.prose-editor :global(.ProseMirror-focused) {
		outline: none;
	}

	/* Placeholder styling */
	.placeholder-text {
		position: absolute;
		top: 1rem;
		left: 1rem;
		z-index: 1;
		pointer-events: none;
		color: #9ca3af;
		font-style: italic;
	}

	/* Custom toolbar button styling */
	.toolbar-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border: 1px solid transparent;
		border-radius: 0.375rem;
		background: none;
		cursor: pointer;
		font-size: 0.875rem;
		color: #374151;
		transition: all 0.2s;
		padding: 0;
		margin: 0;
	}

	.toolbar-button:hover {
		background-color: #f3f4f6;
		border-color: #d1d5db;
	}

	.toolbar-button:active {
		background-color: #e5e7eb;
		border-color: #9ca3af;
	}

	/* Dropdown styling */
	.dropdown-container {
		position: relative;
		display: inline-block;
	}

	.dropdown-menu {
		position: absolute;
		top: 100%;
		left: 0;
		z-index: 50;
		min-width: 150px;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 0.375rem;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.1),
			0 2px 4px -1px rgba(0, 0, 0, 0.06);
		margin-top: 0.25rem;
	}

	.dropdown-item {
		display: block;
		width: 100%;
		text-align: left;
		padding: 0.5rem 0.75rem;
		border: none;
		background: none;
		cursor: pointer;
		font-size: 0.875rem;
		color: #374151;
		transition: background-color 0.2s;
	}

	.dropdown-item:hover {
		background-color: #f3f4f6;
	}

	.dropdown-item:first-child {
		border-top-left-radius: 0.375rem;
		border-top-right-radius: 0.375rem;
	}

	.dropdown-item:last-child {
		border-bottom-left-radius: 0.375rem;
		border-bottom-right-radius: 0.375rem;
	}

	/* Editor content styling */
	.prose-editor :global(.ProseMirror p) {
		margin: 0.5em 0;
	}

	.prose-editor :global(.ProseMirror h1) {
		font-size: 1.5em;
		font-weight: bold;
		margin: 0.5em 0;
	}

	.prose-editor :global(.ProseMirror h2) {
		font-size: 1.25em;
		font-weight: bold;
		margin: 0.5em 0;
	}

	.prose-editor :global(.ProseMirror h3) {
		font-size: 1.1em;
		font-weight: bold;
		margin: 0.5em 0;
	}

	.prose-editor :global(.ProseMirror ul) {
		margin: 0.5em 0;
		padding-left: 1.5em;
	}

	.prose-editor :global(.ProseMirror ol) {
		margin: 0.5em 0;
		padding-left: 1.5em;
	}

	.prose-editor :global(.ProseMirror li) {
		margin: 0.25em 0;
	}

	.prose-editor :global(.ProseMirror strong) {
		font-weight: bold;
	}

	.prose-editor :global(.ProseMirror em) {
		font-style: italic;
	}

	.prose-editor :global(.ProseMirror code) {
		background-color: #f3f4f6;
		padding: 0.125em 0.25em;
		border-radius: 0.25em;
		font-family: monospace;
		font-size: 0.875em;
	}

	.prose-editor :global(.ProseMirror pre) {
		background-color: #f3f4f6;
		padding: 1em;
		border-radius: 0.5em;
		overflow-x: auto;
		margin: 0.5em 0;
	}

	.prose-editor :global(.ProseMirror pre code) {
		background-color: transparent;
		padding: 0;
	}

	.prose-editor :global(.ProseMirror blockquote) {
		border-left: 4px solid #e5e7eb;
		padding-left: 1em;
		margin: 0.5em 0;
		color: #6b7280;
	}

	.prose-editor :global(.ProseMirror hr) {
		border: none;
		border-top: 1px solid #e5e7eb;
		margin: 1em 0;
	}

	.prose-editor :global(.ProseMirror a) {
		color: #2563eb;
		text-decoration: underline;
	}

	.prose-editor :global(.ProseMirror a:hover) {
		color: #1d4ed8;
	}
</style>
