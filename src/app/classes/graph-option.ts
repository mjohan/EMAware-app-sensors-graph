import { FilterOption } from '../classes/filter-option'

export class GraphOption {
	index: number;
	map: FilterOption;
	name: string;
	selectItems: Array<{
		name: string;
		value: FilterOption;
	}>;
}
