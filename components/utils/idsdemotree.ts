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

    const tree2 = new Tree(2);
    tree2.Merge(tree);

    const tree3 = new Tree(3);
    tree3.Merge(tree);

    tree2.AddSequence({Timestamp: 4, EntityID: 1}, [" ", "A", "p", "p", "l", "e", "s"]);
    tree3.AddSequence({Timestamp: 4, EntityID: 1}, [" ", "P", "e", "a", "r", "s"]);

    tree.Merge(tree2);
    tree.Merge(tree3);

    return tree;
}