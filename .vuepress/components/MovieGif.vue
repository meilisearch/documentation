<template>
  <div>
    <video class="video" autoplay="true" poster="truemen.jpg" loop muted>
      <source src="/movie-gifs/trumen-fast.webm" type="video/webm">
      <source src="/movie-gifs/trumen-fast.mp4" type="video/mp4">
    </video>
  </div>
</template>

<script>
export default {
  name: 'MovieGif',
}
</script>

<style lang="css" scoped>

video{
  width: 754px;
  height: auto;
}

/*  Large devices (desktops, less than 1200px) */
@media (max-width: 1199.98px) {
  video{
   width: 617px;
   height: auto;
  }
 }

 /* Medium devices (tablets, less than 992px) */
@media (max-width: 991.98px) {
  video{
    width: 420px;
    height: auto;
  }
 }

 /* Small devices (landscape phones, less than 768px) */
@media (max-width: 767.98px) {
  video{
    width: 495px;
    height: auto;
  }

}

 /* Extra small devices (portrait phones, less than 576px) */
@media (max-width: 575.98px) {
  video{
    width: 370px;
    height: auto;
  }
 }

</style>
