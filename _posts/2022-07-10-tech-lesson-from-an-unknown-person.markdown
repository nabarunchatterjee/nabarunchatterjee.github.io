---
layout: post
category: tech
title: Tech lessons from an unknown person
permalink: /tech-lessons-from-an-unknown-person/
thumbnail: "/assets/images/tech-lessons/cover.jpeg"
excerpt_separator: <!--More-->
tags:
    - "2022"
    - myMemoryStore
    - tech
---
| ![cover.jpg]({{site.url}}/assets/images/tech-lessons/cover.jpeg) |

The day before yesterday (08-07-2022) I had published a video on YouTube titled

`How to Make a memory in myMemoryStore` and something amazing and unexpected happened.

No!!! Contrary to popular belief and to my complete amazement the video did not go viral.

Someone unknown to me tried to create a memory. The memory got created but
could not be opened. No one complained but I, as the sole developer of the
website, took it up as a public embarrassment.  The damage was already done but
at least having an idea of why it happened and making sure that this does not
happen in the future would salvage my honor to some extent.

I put my debugging hat on and started to solve the mystery.

<!--More-->

Anyone who has not seen the video should watch the video embedded below to
understand the rest of the content better.


<div class="iframe-container">
<iframe  src="https://www.youtube.com/embed/QrSxFL3ls3o" frameborder="0" allowfullscreen></iframe>
</div>


I created a memory of my own and it worked perfectly. So I had to assume that
something had gone wrong while creating that specific memory.  I started
checking the console logs while trying to open that memory. There were a bunch
of network errors but nothing concrete that would point me in any direction.
So I started looking into the cloud storage where the pictures would be stored.
What I found out was few of the resized images were not present but the original
pictures were all there.

I have no way of knowing what actually happened but 2 probable scenarios come
to mind.

`Scenario 1`: There was an intermittent network glitch on the client-side.

`Scenario 2`: The resizing of some images failed and there was nothing to upload.

To understand why I came to these conclusions, let us look at how a memory is
currently created in myMemoryStore.

## Present Memory Creation Process
<img src="https://docs.google.com/drawings/d/e/2PACX-1vRpVDTJp6y-nXHkLrDHdBzBAZkGxCZW54QWSzxTkUmPy2UFYpjOf3fe5wG7WeUYFl5J8fXQ-oCO7_RT/pub?w=960&amp;h=720">

As you can see in the diagram above there 4 steps to the memory creation process:
1. Client uploads memory detail and thumbnail to cloud.
2. Client resizes all images.
3. Client uploads all resized images.
4. Client uploads all original images.

By now you might have noticed I have somehow managed to make the uploading process
a 3-step process unlike the 1-step process it is for all sane people.

This is what I have to say in my defense.

I did not want to send all the pictures to the server which would then upload
the pictures to the cloud.  This would use network bandwidth unnecessarily and
would also increase the time needed to create the memory.

I could not upload the pictures directly to the cloud as there is no secure way
(that I know of) to store cloud credentials in the frontend.

`Solution`

The client asks the server(which has access to the cloud service) for a presigned
URL to the specified location on the cloud storage which will allow PUT
requests on that location for a small time without authentication as it is
presigned.

Let me know if there is a better way to achieve this.

Coming back to the two scenarios of why the problem might have been caused.

`Scenario 1 Justification`: I say intermittent network issue as, if there was
complete network failure the original images would not have been uploaded as
they come later in the memory creation process.

`Scenario 2 Justification`: This is pretty self-justifying. The resize failed
for some reason on the client's device and thus there was nothing to upload.

Reiterating, I have no way to know for sure what happened as I do not have
logs. So hi (Unknown Memory maker), if you are seeing this, please come forward
and enlighten me so that I can avoid such situations in the future.


Now, let me correct my mistakes and propose a new workflow to create a memory.

`Observation 1`
While creating a memory only the memory details and the original images are
information that is provided by the client/user. Rest of the data i.e. the
thumbnail and the resized images are derived data that can be created at any
point in time. The significance is that once the original images and the memory
details are sent to the cloud storage the rest of the data can be
computed/reconciled even after a failure of any kind.

*Note* : Due to this I was able to download the original images from the broken
memory and create the resized images and make the memory work properly.

`Observation 2`
There is no point in putting unnecessary load on the client to resize images
as it can be easily done on the server which has more computation capacity.

Hence the proposed solution as shown in the diagram below.
## Proposed Memory Creation Process
<img src="https://docs.google.com/drawings/d/e/2PACX-1vQk4trIMNamoe1hOqJdwOmd3zfxsO-H5AuIQFHr99hm2S96pJBnJN60yJ_qlGrTTiKuLv6GTEvIHuRe/pub?w=960&amp;h=720">

So in the new approach, the memory creation process is as follows:
1. Client uploads the memory details to the cloud using the 3-step upload.
2. Client uploads original images to the cloud storage.
3. Tell the server the memory id.
4. The server does the following tasks:
    - Download all images
    - Resize the images
    - Upload all resized images and thumbnail
5. Server lets the client know that the memory can be viewed now.

This procedure ensures that if the original data reaches the cloud storage, it
is guaranteed that the memory can be reconstructed even after a failure.

That brings us to the end of this article. Do let me know if there is a better
way to approach this issue.

Also, let me know if you are interested in knowing how this plan is executed and
what challenges I face doing the same.

Bye for now. Hope you have a great day.


