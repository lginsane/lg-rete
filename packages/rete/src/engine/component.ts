import { Engine } from './index';
import { NodeData, WorkerInputs, WorkerOutputs } from '../core/data';

export abstract class Component {
    id: string;
    name: string;
    data: unknown = {};
    engine: Engine | null = null;

    constructor(id: string) {
        this.id = id;
    }

    abstract worker(node: NodeData, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]): void;
}