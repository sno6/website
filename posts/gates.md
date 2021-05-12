---
title: "Gates, Laziness, and Automation"
date: "2021-05-11"
readingMins: 5
---

<p>The following is an overview of how I built and installed an automatic vehicle entry system at my dad’s house using an IP camera and a Raspberry Pi. Or, said differently, how I was too lazy to get out of my car and walk 5 meters to open a gate.</p>

<p>But before we get into the details, a demo!</p>

<video width="100%" height="480" controls>
  <source src="/misc/demo-gate.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>

<b>Equipment I used</b>

<ul>
	<li>A PoE camera that has motion detection capabilities. I chose a model similar to <a href="https://www.hikvision.com/en/products/IP-Products/Network-Cameras/Ultra-Series-SmartIP-/ds-2cd3686g2-izs0/">this.</a></li>
	<li>A spare remote for your gate.</li>
	<li>Raspberry Pi or Arduino.</li>
    <li>5v relay. I went with <a href="https://www.jaycar.co.nz/arduino-compatible-5v-relay-board/p/XC4419">this</a> fella because it was cheap and I could get it locally.</li>
    <li>An ethernet cable long enough to reach from the camera to a network switch.</li>
    <li>Conduit housing for the ethernet cable.</li>
    <li>3 x jumper wires.</li>
</ul>

<b>Technical Details</b>

<p>The first order of business was setting up the Pi. I decided to use the wonderful <a href=”https://www.balena.com”>Balena</a> to help with this. Balena allows me to easily push code to the pi remotely, monitor logs and health via the cloud, and ease the flashing/setup process which is typically a headache.</p>

<p>After I got the Pi set up, and validated that I could push code to it and execute that code, I decided to test the relay. In order to get the relay connected to the Pi, we need to attach jumper wires from the NC and Signal terminals of the relay into the corresponding GPIO pins of the Pi.</p>

<p>I then wrote some <a href="https://github.com/sno6/gate-god/blob/master/relay/relay.go">code</a> to turn on and off the relay to make sure I wired everything correctly.</p>

<img src="/misc/pi-relay.jpeg" />

<p>After validating that the Pi can trigger the relay, I wired up the outputs to the remote control. In case you’re wondering, it’s also possible to avoid all of this wiring by relaying the RF signal from the Pi using a RF module. However, most modern gates/garage doors have <a href="https://en.wikipedia.org/wiki/Rolling_code">protections</a> against this.</p>

<img src="/misc/pi-relay-controller.jpeg" />

<p>As you can see, I've soldered the wires from the relay to the two terminals of the remote button (make sure it's the right button!!). Essentially, we are just shorting the circuit to trigger the remote. Again, validate the flow by running the previously mentioned code and you should have a working Pi powered remote for your gate.</p>

<p>Now we've got the bulk of the hardware setup out of the way it's time to work with our camera. Unfortunately, the model I purchased was getting a little long in the tooth, and as a consequence, only allowed me to send frames on motion over FTP. So I <a href="https://github.com/sno6/gate-god/blob/master/server/ftp/ftp.go">wrote</a> an FTP server to run on the Pi and process the frames as they come in. When a new frame hits the server, it sends it over to the amazing <a href="https://platerecognizer.com">PlateRecognizer</a> service to find any license plates that could be in the frame. If we find a plate that is in our whitelist (defined in a config file), we simply trigger the relay to open the gate. There's obviously a little more to it than that, such as finding the “best” frame out of a batch, so I urge you to take a look at the <a href="https://github.com/sno6/gate-god">code</a> if you're following along.</p>

<p>We've now got a Pi that can receive frames from a camera, check for license plates, and open a gate if it sees someone it recognises. I decided to do a little house keeping and put the Pi in a case, as you can see below.</p>

<img src="/misc/house-keeping.jpeg" />

<b>Installation</b>

<p>The distance from the front gate to the PoE injector inside the house is roughly 35 meters, which is a little too far for stray cable. We decided to dig a shallow trench from the house to the gate and run the ethernet cable underground in some conduit housing. Funnily enough, this turned out to be the most difficult and time consuming part of the whole process.</p>

<img src="/misc/trench.jpeg" />

<p>And that's about it. Slap the dirt back on and start testing your new vehicle entry system.</p>

<p>I hope you enjoyed the post. If you're looking for a bit more detail or have any questions about how this system was built, reach out via email (it can be found in my CV on the home page). This was a super fun project to work on with and for my dad, and hopefully I will be able to post more projects like this one in the near future.</p>

