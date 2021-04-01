import { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';

const TextEditor: React.FC = () => {
	const ref = useRef<HTMLDivElement | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [value, setValue] = useState('# Header');

	useEffect(() => {
		const listener = (event: MouseEvent) => {
			// if ref.current and event.target exist
			// and ref.current is the event.target
			if (
				ref.current &&
				event.target &&
				ref.current.contains(event.target as Node)
			) {
				return; // do nothing
			}

			setIsEditing(false);
		};

		document.addEventListener('click', listener, { capture: true });

		return () => {
			document.removeEventListener('click', listener, { capture: true });
		};
	}, []);

	if (isEditing) {
		return (
			<div className='text-editor' ref={ref}>
				<MDEditor value={value} onChange={(val) => setValue(val || '')} />
			</div>
		);
	}

	// preview component
	return (
		<div className='text-editor card' onClick={() => setIsEditing(true)}>
			<div className='card-content'>
				<MDEditor.Markdown source={value} />
			</div>
		</div>
	);
};

export default TextEditor;
