import produce from 'immer';
import { CellActionType } from '../action-types';
import { CellAction } from '../actions';
import { Cell } from '../cell';

interface CellsState {
	loading: boolean;
	error: string | null;
	order: string[];
	data: {
		[key: string]: Cell;
	};
}

const initialState: CellsState = {
	loading: false,
	error: null,
	order: [],
	data: {},
};

const reducer = produce((state: CellsState, action: CellAction) => {
	switch (action.type) {
		case CellActionType.UPDATE_CELL:
			const { id, content } = action.payload;
			state.data[id].content = content;
			return;

		case CellActionType.DELETE_CELL:
			delete state.data[action.payload];
			state.order = state.order.filter((id) => id !== action.payload);
			return;

		case CellActionType.MOVE_CELL:
			const { direction } = action.payload;
			const index = state.order.findIndex((id) => id === action.payload.id);
			const targetIndex = direction === 'up' ? index - 1 : index + 1;

			// invalid index
			if (targetIndex < 0 || targetIndex > state.order.length - 1) {
				return;
			}
			// swap logic
			state.order[index] = state.order[targetIndex];
			state.order[targetIndex] = action.payload.id;

			return;

		case CellActionType.INSERT_CELL_AFTER:
			const cell: Cell = {
				id: randomId(),
				type: action.payload.type,
				content: '',
			};

			state.data[cell.id] = cell;

			const foundIndex = state.order.findIndex(
				(id) => id === action.payload.id
			);

			if (foundIndex < 0) {
				state.order.unshift(cell.id);
			} else {
				state.order.splice(foundIndex + 1, 0, cell.id);
			}

			return;

		default:
			return;
	}
}, initialState);

const randomId = () => {
	return Math.random().toString(36).substr(2, 5);
};

export default reducer;