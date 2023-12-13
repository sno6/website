import DotDivider from "../../components/dotdivider";
import CausalScene, { Scenes } from "../../components/causalscene";

export default function Causal() {
    return (
        <div>
            <p style={{color: "#E8DCB9"}}>
                Yo - this is a first DRAFT, the demo's are mostly complete but the text content will change over the next couple days.
            </p>

            <p>
                I recently came across an elegant CRDT design that is useful for text collaboration applications. What follows is the blog post I wish I had when I started learning about CRDTs, I hope you find it informative.
            </p>

            <p>
                CRDTs are a family of algorithms and datastructures that provide eventual consistency guarantees by implementing some simple mathematical properties. As their popularity has increased over the last decade, so too has their usage. CRDTs are commonly found in collaborative applications, where concurrent updates can be frequent, but they’re also used quite extensively in local network and peer-to-peer environments, due to the algorithms not requiring a central authority to reconcile inconsistencies. That last sentence is quite important, because it means that we can get distributed eventual consistency (things eventually converge to a consistent value among nodes) without complicated processes such as consensus!
            </p>

            <p>
                The CRDT I will be describing today is the Causal Tree (roughly as described by Victor Grishchenko [0]). Which we will look at in the context of a simple text collaboration application. But before we go too far, play around with the example below and see if you can get an intuitive sense of how the algorithm operates. Some things to keep an eye out for are the ids associated with each node (on hover), and also what happens when individual characters are deleted.
            </p>

            <DotDivider />

            <CausalScene scene={Scenes.TwoClient} />

            <p>
                Hopefully now you have a rough idea about the structure of the tree. Each client in the above example has their own local Causal Tree, the compiled value of which is written to their individual text input. This implementation is known as a state-based CRDT, or CvRDT, which means that we send the whole tree to clients instead of only individual operations as they occur. When client 1 makes a change to their tree, they send the tree data to other clients that might want it, who perform a merge operation with their own local tree. The magic here happens within the merge operation. Merging needs to guarantee that the value that is produced after the merge is *consistent*, that is, any two trees that have the same nodes would merge and produce the same output, regardless of order or duplicate merges.
            </p>

            <p>
                So to recap, we have a tree per client, clients can update their own tree, send it to others, and also merge other trees into their own in a way that is *consistent*. Now let’s go down a level and talk about the tree structure and what it means for operations to be related causally.
            </p>

            <p>
                In our toy text collaboration example, each node represents an individual character. You may have noticed that each node’s parent is the letter that directly precedes the node. This ordering is one half of the equation that allows us to position the characters consistently. Take for example an alternative structure where each character has an array index position instead.
            </p>

            <p>[h e l l o]</p>
            <p>[0 1 2 3 4]</p>

            <p>Now imagine that you went on to add an exclamation mark at the end of the string, but concurrently with that operation you merged changes from another client that added the string “Welcome and “ before “hello”. You’re now left with “Welco!me and hello”, which was not your original intention. Now, you _could_ bake in some logic to your application that adjusts your old index to account for the new changes, shifting the index of each character in “hello” by the amount of characters that were inserted, but that’s not the elegant algorithm that I promised. That’s something else known as Operation Transformation (OT) that folks that like to complicate things use (Google Docs).</p>

            <p>A much simpler approach would be to simply associate a node with the node preceding it. If we did that, it wouldn’t matter if the underlying tree changed, it would still preserve our original intention. In essence we use a relative node position instead of an absolute text position.</p>

            <p>But how do nodes reference each other? If you hover over the tree nodes below you will notice that each node has two identifiers, one timestamp id and one entity id. A timestamp is a monotonically increasing integer that is the timestamp value of the tree that produced the node at the time of producing the node. Because wall clocks in distributed systems are unreliable, we use this method combined with the entity id to create a total ordering. The only slightly tricky part here is that when a merge operation occurs, each tree updates their local timestamp to be the max of the two trees’ timestamps. Intuitively, you can think of the ids as a way to tell how much of the state a client knows about. [expand on this with out of sync examples]</p>

            <p>Hover over the nodes in the example above and see if you can figure out what the final value will be based on the ids alone. Click “Reveal” if you get stuck</p>

            <DotDivider />

            <CausalScene scene={Scenes.IDDemo} />

            <p>The text operations that created that tree are as follows:</p>
            <ul>
                <li>Client 1 types “Causatrees”</li>
                <li>Client 1 adds “l ” after the “a” to create “Causal trees”.</li>
            </ul>
            <p>If you follow the ids in ascending order you will get the incorrect “Causatrees l” </p>

            <p>Which brings us to an important topic, tree traversal and sibling trees. To produce the correct final value we need to traverse the tree in depth-first pre-order, but with a special case for sibling branches:</p>
            <ul>
                <li>If a node has multiple children (sibling branches) traverse the branches with higher timestamps first.</li>
                <li>If branches have the same timestamp, traverse the tree with the higher entity ID.</li>
            </ul>

            <p>Below is an example of a more complex scenario where multiple clients are making edits, keep in mind we’re viewing client 1’s tree.</p>

            <p>In this case we have client 1 writing “I ❤” and then concurrently after client 2 and 3 receive what client 1 had written, they type “ Pears” and “ Apples” respectively. We can see that represented in the sibling trees after the heart. Note that this solves a complex and common problem with rich text CRDTs which is known as interleaving, where the output could come out jumbled due to the concurrent updates.</p>

            <CausalScene scene={Scenes.ThreeClient} />

            <p>Talk about how deletion works..</p>

            <p>Talk about GC and optimizations..</p>

            <p>Link to further reading..</p>
        </div>
    )
}