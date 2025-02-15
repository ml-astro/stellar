const system = document.createElement("canvas");
    const systemId = document.createAttribute("id");
    const systemWidth = document.createAttribute("width");
    const systemHeight = document.createAttribute("height");
    systemId.value = "myCanvas";
    console.log(document.clientWidth);

    systemWidth.value = window.innerWidth + 'px';
    systemHeight.value = window.innerHeight + 'px';
    system.setAttributeNode(systemId);
    system.setAttributeNode(systemWidth);
    system.setAttributeNode(systemHeight);
    document.getElementsByClassName('system')[0].appendChild(system);

    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    var play = false;


    //planet data for reference date
    const planets = [
      {//mercury
        distance: 57.9,
        //offset: -161.72,
        offset: -135.72,//visual, not based on reference date
        step: 4.092346,
        color: "#AAA",
        size: 3,
      },
      {//venus
        distance: 108.2,
        offset: -34.6,
        step: 1.6021,
        color: "#EEE",
        size: 4,
      },
      {//earth
        distance: 149.0,
        offset: -90.0,
        step: 0.985609,
        color: "#44F",
        size: 4,
      },
      {//mars
        distance: 228.0,
        offset: -104.29,
        step: 0.52403,
        color: "#F33",
        size: 3,
      },
      {//jupiter
        distance: 778.5,
        offset: -77.44,
        step: 0.08309,
        color: "#E99",
        size: 8,
      },
      {//saturn
        distance: 1433.5,
        offset: -349.437,
        step: 0.03341,
        color: "#CAA",
        size: 8,
      },
      {//uranus
        distance: 2871.0,
        offset: -55.593,
        step: 0.0117,
        color: "#99C",
        size: 6,
      },
      {//neptune
        distance: 4500.0,
        offset: -359.068,
        step: 0.006,
        color: "#99A",
        size: 6,
      },
    ];

    //keyboard and mouse wheel controlled zoom + -
    window.addEventListener('wheel', e => {
      (e.deltaY > 0) ? zoomView('out') : (zoomView('in'));
    }
    )
    window.addEventListener('keydown', e => {
      switch (e.key) {
        case '+': zoomView('in');
          break;
        case '-': zoomView('out');
          break;
      }
    })

    let animate;
    let step;
    var zoom = 1;

    //offset from reference date
    const referenceDate = new Date('2024-12-21');

    //переменная для подсчета отступа от оригинала, используется при генерировании системы
    var today = new Date();
    var daysOffset = ((today - referenceDate) / 86400000);
    document.getElementById('dateField').textContent = today.getDate() + '.' + today.getMonth() + 1 + '.' + today.getFullYear();

    //initial system for today
    generateSystem(daysOffset, zoom);

    //generate new date using step value
    function animationStep(x) {
      clearInterval(animate)
      step = x;
      //and add days to for next frame
      animate = setInterval(() => {
        daysOffset += step;
        generateSystem(daysOffset, zoom)
      }, 100);
    }

    //stop animation
    function stop() {
      clearInterval(animate);
    }

    //add 0 before date and month
    function smallDateFormat(number) {
      if (number < 10) {
        return '0' + number;
      }
      else return number
    }

    //display date on screen
    function displayDate() {
      var frameDate = new Date(referenceDate);
      frameDate.setDate(referenceDate.getDate() + daysOffset);
      let dateString = smallDateFormat(frameDate.getDate()) + '.' + smallDateFormat(frameDate.getMonth() + 1) + '.' + frameDate.getFullYear();
      document.getElementById('dateField').textContent = dateString;
    }

    //sets the scale of drawings
    function zoomView(mode) {
      if (mode == 'in') {
        zoom = zoom * 0.9;
      }
      if (mode == 'out') {
        zoom = zoom * 1.1;
      }
      generateSystem(daysOffset, zoom);
    }


    function generateSystem(delay, zoom) {
      displayDate();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      ctx.fillStyle = 'black';
      ctx.fillRect(10, 10, canvas.height, canvas.height);

      //draw sun
      ctx.beginPath();
      ctx.arc(centerX, centerY, 10, 0, 2 * Math.PI);
      ctx.fillStyle = 'yellow';
      ctx.fill();

      //draw planets and orbits
      planets.forEach(planet => {
        //draw orbit
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.arc(centerX, centerY, planet.distance / zoom, 0, 2 * Math.PI);
        ctx.stroke();

        //calculate phase
        let phase = (planet.offset - planet.step * delay) * Math.PI / 180;
        //draw planet with translation applied
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(phase);
        ctx.beginPath();
        ctx.arc(planet.distance / zoom, 0, planet.size * 2, 0, 2 * Math.PI);
        ctx.fillStyle = planet.color;
        ctx.fill();
        ctx.restore();
      });
    }
