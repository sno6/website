export type ID = {
    Timestamp: number;
    EntityID: number;
}

export class CausalNode {
    ID: ID;
    V: string;
    Removed: boolean;
    Parent: CausalNode | null;
    Children: CausalNode[];

    constructor(ID: ID, V: string, Parent: CausalNode | null = null) {
        this.ID = ID;
        this.V = V;
        this.Parent = Parent;
        this.Removed = false;
        this.Children = [];
    }
}

export class Tree {
    ID: ID;
    Root: CausalNode;

    constructor(entityID: number) {
        this.ID = { Timestamp: 1, EntityID: entityID };
        this.Root = new CausalNode({ Timestamp: 0, EntityID: entityID }, '');
    }

    String() {
        let s = "";
        this.traverseFunc(this.Root, (node) => {
            if (!node.Removed) {
                s += node.V;
            }
        })
        return s;
    }

    AddSequence(parentID: ID | null, seq: string[], entityID?: number): ID {
        let currentParentID = parentID;
        for (const v of seq) {
            currentParentID = this.AddCausalNode(currentParentID, v, entityID);
            if (entityID) {
                currentParentID.EntityID = entityID;
            }
        }
        return currentParentID!;
    }

    AddCausalNode(parentID: ID | null, v: string, entityID?: number): ID {
        let parent = this.Root;
        if (parentID !== null) {
            const foundParent = this.Find(parentID);
            if (foundParent) {
                parent = foundParent;
            }
        }

        const newID = JSON.parse(JSON.stringify(this.IncrTimestamp()));
        if (entityID) {
            // Cheeky fake merge logic.
            newID.EntityID = entityID
        }

        const newCausalNode = new CausalNode(newID, v, parent);
        parent.Children.push(newCausalNode);

        return this.ID;
    }

    IncrTimestamp(): ID {
        this.ID.Timestamp += 1;
        return this.ID;
    }

    RemoveCausalNode(id: ID): void {
        const CausalNode = this.Find(id);
        if (CausalNode) {
            CausalNode.Removed = true;
        }
    }

    OrderedCausalNodes(includeRemoved: boolean): CausalNode[] {
        const CausalNodes: CausalNode[] = [];
        this.traverseFunc(this.Root, (CausalNode) => {
            if (!includeRemoved && CausalNode.Removed) {
                return;
            }
            CausalNodes.push(CausalNode);
        });
        return CausalNodes;
    }

    private traverseFunc(current: CausalNode, f: (CausalNode: CausalNode) => void): void {
        f(current);

        let children = [...current.Children];
        children = children.sort((a, b) => Number(IDLess(a.ID, b.ID)));

        for (const CausalNode of children) {
            this.traverseFunc(CausalNode, f);
        }
    }

    Merge(src: Tree): void {
        this.ID.Timestamp = Math.max(src.ID.Timestamp, this.ID.Timestamp);

        for (const n of src.OrderedCausalNodes(true)) {
            if (this.Exists(n.ID)) {
                const ours = this.Find(n.ID);
                if (n.Removed && ours && !ours.Removed) {
                    this.RemoveCausalNode(n.ID);
                }
                continue;
            }

            if (n.Parent) {
                const parentID = n.Parent.ID;
                if (!this.Exists(parentID)) {
                    throw new Error("parent should exist for CausalNode to be added");
                }

                const parent = this.Find(parentID);
                if (!parent) {
                    throw new Error("parent should exist for CausalNode to be added");
                }
                parent.Children.push(new CausalNode(n.ID, n.V, parent));
                if (n.Removed) {
                    parent.Children[parent.Children.length - 1].Removed = true;
                }
            }
        }
    }

    Exists(id: ID): boolean {
        if (this.isRoot(id)) {
            return true;
        }
        let exists = false;
        this.traverseFunc(this.Root, (CausalNode) => {
            if (!exists && IDEquals(CausalNode.ID, id)) {
                exists = true;
            }
        });
        return exists;
    }

    Find(id: ID): CausalNode | null {
        if (this.isRoot(id)) {
            return this.Root;
        }
        let foundCausalNode: CausalNode | null = null;
        this.traverseFunc(this.Root, (CausalNode) => {
            if (!foundCausalNode && IDEquals(CausalNode.ID, id)) {
                foundCausalNode = CausalNode;
            }
        });
        return foundCausalNode;
    }

    private isRoot(id: ID): boolean {
        return id.Timestamp === 0;
    }
}

function IDEquals(id1: ID, id2: ID): boolean {
    return id1.Timestamp === id2.Timestamp && id1.EntityID === id2.EntityID;
}

function IDLess(id1: ID, id2: ID): number {
    if (id1.Timestamp === id2.Timestamp) {
        return id1.EntityID < id2.EntityID ? 1 : -1;
    }
    return id1.Timestamp < id2.Timestamp ? 1 : -1;
}