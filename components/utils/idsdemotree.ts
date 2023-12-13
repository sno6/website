import { Tree } from "./causaltree";

export const IDsDemoTree = (): Tree => {
    const tree = new Tree(1);
    tree.AddSequence(tree.ID, ["C", "a", "u", "s", "a"])
    tree.AddSequence(tree.ID, ["t", "r", "e", "e", "s"])
    const lid = tree.AddCausalNode({Timestamp: 6, EntityID: 1}, "l")
    tree.AddCausalNode(lid, " ")
    return tree;
}

export const ThreeClientDemoTree = (): Tree => {
    const tree = new Tree(1);
    tree.AddSequence(tree.ID, ["I", " ", "❤"])
    tree.AddSequence({EntityID: 1, Timestamp: 4}, [" ", "A", "p", "p", "l", "e", "s"], 2)
    tree.AddSequence({EntityID: 1, Timestamp: 4}, [" ", "P", "e", "a", "r", "s"], 3)
    return tree;
}