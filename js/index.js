var ESTADOS = {
    'ACRE': ['Acre', 'AC', 'NORTE'],
    'ALAGOAS': ['Alagoas', 'AL', 'NORDESTE'],
    'AMAPÁ': ['Amapá', 'AP', 'NORTE'],
    'AMAZONAS': ['Amazonas', 'AM', 'NORTE'],
    'BAHIA': ['Bahia', 'BA', 'NORDESTE'],
    'CEARÁ': ['Ceará', 'CE', 'NORDESTE'],
    'DISTRITO FEDERAL': ['Distrito Federal', 'DF', 'CENTRO-OESTE'],
    'ESPIRITO SANTO': ['Espírito Santo', 'ES', 'SUDESTE'],
    'GOIÁS': ['Goiás', 'GO', 'CENTRO-OESTE'],
    'MARANHÃO': ['Maranhão', 'MA', 'NORDESTE'],
    'MATO GROSSO': ['Mato Grosso', 'MT', 'CENTRO-OESTE'],
    'MATO GROSSO DO SUL': ['Mato Grosso do Sul', 'MS', 'CENTRO-OESTE'],
    'MINAS GERAIS': ['Minas Gerais', 'MG', 'SUDESTE'],
    'PARÁ': ['Pará', 'PA', 'NORTE'],
    'PARAÍBA': ['Paraíba', 'PB', 'NORDESTE'],
    'PARANÁ': ['Paraná', 'PR', 'SUL'],
    'PERNAMBUCO': ['Pernambuco', 'PE', 'NORDESTE'],
    'PIAUÍ': ['Piauí', 'PI', 'NORDESTE'],
    'RIO DE JANEIRO': ['Rio de Janeiro', 'RJ', 'SUDESTE'],
    'RIO GRANDE DO NORTE': ['Rio Grande do Norte', 'RN', 'NORDESTE'],
    'RIO GRANDE DO SUL': ['Rio Grande do Sul', 'RS', 'SUL'],
    'RONDÔNIA': ['Rondônia', 'RO', 'NORTE'],
    'RORAIMA': ['Roraima', 'RR', 'NORTE'],
    'SANTA CATARINA': ['Santa Catarina', 'SC', 'SUL'],
    'SÃO PAULO': ['São Paulo', 'SP', 'SUDESTE'],
    'SERGIPE': ['Sergipe', 'SE', 'NORDESTE'],
    'TOCANTINS': ['Tocantins', 'TO', 'NORDESTE']
};
ESTADOS_POR_SIGLA = _.groupBy(ESTADOS, function(d){return d[1]});
ESTADOS_POR_REGIAO = _.groupBy(ESTADOS, function(d){return d[2]});
var REGIOES = {
    'NORTE': 'Norte',
    'NORDESTE': 'Nordeste',
    'CENTRO-OESTE': 'Centro Oeste',
    'SUDESTE': 'Sudeste',
    'SUL': 'Sul'
}

var Data = {
    init: function() {
        var self = this;
        self.init_voto_por_estado();
        self.init_voto_por_regiao();
        self.init_voto_por_partido();
        self.init_corruptos();
    },
    init_corruptos: function() {
        // Estado
        corruptos_por_estado =  _.groupBy(votos, function(d){return d.uf});
        corruptos_por_estado = _.mapObject(corruptos_por_estado, function(val, key){
            return _.reduce(val, function(memo, obj){
                n_ocorrencias = parseInt(obj.n_ocorrencias, 10);
                if (n_ocorrencias)
                    return memo + 1;
                return memo;
            }, 0);
        });
        corruptos_por_estado_normalizado = _.mapObject(corruptos_por_estado, function(val, key){
            return val/max_votos_por_estado[key];
        });
        // Regiao
        corruptos_por_regiao = {
            'NORTE': 0,
            'NORDESTE': 0,
            'CENTRO-OESTE': 0,
            'SUDESTE': 0,
            'SUL': 0
        }
        _.each(corruptos_por_estado, function(n_corruptos, estado) {
            var regiao = ESTADOS_POR_SIGLA[estado][0][2];
            corruptos_por_regiao[regiao] = corruptos_por_regiao[regiao] + n_corruptos;
        });
        corruptos_por_regiao_normalizado = _.mapObject(corruptos_por_regiao, function(val, key){
            return val/max_regiao[key];
        });
    },
    init_voto_por_partido: function() {
        votos_por_partido = _.groupBy(votos, function(d){return d.partido});
        votos_por_partido = _.mapObject(votos_por_partido, function(val, key){
            return _.reduce(val, function(memo, obj){
                if (obj.voto == -1) return memo;
                return memo + obj.voto;
            }, 0);
        });
        max_votos_por_partido = _.groupBy(votos, function(d){return d.partido});
        max_votos_por_partido = _.mapObject(max_votos_por_partido, function(val, key){
            return _.reduce(val, function(memo, obj){
                if (obj.voto == -1) return memo;
                return memo + 1;
            }, 0);
        });
    },
    init_voto_por_estado: function() {
        votos_por_estado = _.groupBy(votos, function(d){return d.uf});
        max_votos_por_estado = {
            'AC': 8,
            'AL': 9,
            'AM': 8,
            'AP': 8,
            'BA': 39,
            'CE': 22,
            'DF': 8,
            'ES': 10,
            'GO': 17,
            'MA': 18,
            'MG': 53,
            'MS': 8,
            'MT': 8,
            'PA': 17,
            'PB': 12,
            'PE': 25,
            'PI': 10,
            'PR': 30,
            'RJ': 46,
            'RN': 8,
            'RO': 8,
            'RR': 8,
            'RS': 31,
            'SC': 16,
            'SE': 8,
            'SP': 70,
            'TO': 8
        };
        votos_por_estado = _.mapObject(votos_por_estado, function(val, key){
            return _.reduce(val, function(memo, obj){
                if (obj.voto == -1) return memo;
                return memo + obj.voto;
            }, 0);
        });
        votos_por_estado_normalizado = _.mapObject(votos_por_estado, function(val, key){
            return val/max_votos_por_estado[key];
        });
    },
    init_voto_por_regiao: function() {
        votos_por_regiao = {
            'NORTE': 0,
            'NORDESTE': 0,
            'CENTRO-OESTE': 0,
            'SUDESTE': 0,
            'SUL': 0
        }
        _.each(votos_por_estado, function(nvotos, estado) {
            var regiao = ESTADOS_POR_SIGLA[estado][0][2];
            votos_por_regiao[regiao] = votos_por_regiao[regiao] + nvotos;
        });
        max_regiao = {
            'NORTE': 57,
            'NORDESTE': 159,
            'CENTRO-OESTE': 41,
            'SUDESTE': 179,
            'SUL': 77
        };
        votos_por_regiao_normalizado = _.mapObject(votos_por_regiao, function(val, key){
            return val/max_regiao[key];
        });
    }
};

MAP_SCALE = colorbrewer.YlGn[9];

map_data = null;
var Map = {
    get_state_fill: function(d, i) {
        var estado = d.properties.name;
        var uf = ESTADOS[estado][1];
        var quantize = d3.scale.quantile()
                         .domain([0, 1])
                         .range(d3.range(9));
        return "q" + quantize(votos_por_estado_normalizado[uf]) + "-9 state"; 
    },
    get_regiao_fill: function(d, i) {
        var regiao = d.properties.region;
        var quantize = d3.scale.quantile()
                         .domain([0, 1])
                         .range(d3.range(9));
        return "q" + quantize(votos_por_regiao_normalizado[regiao]) + "-9 state"; 
    },
    draw_states: function() {
        var self = this;
        var height = 400;
        var width = 500;

        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d, i) {
            var estado = d.properties.name;
            var uf = ESTADOS[estado][1];
            var name = ESTADOS[estado][0];
            var percent = Number(votos_por_estado_normalizado[uf]*100).toFixed(2);
            return "<strong>" + name + "</strong>: " +  "<span>" + percent + "% a favor do impeachment</span>";
          })

        var projection = d3.geo.albers()
          .center([-55,-10])
          .parallels( [12,-28])
          .scale(500)
          .rotate([50,-5,-5])
          .translate([width/2 - 470,height/2 -40]);

        var path = d3.geo.path().projection(projection);

        var svg = d3.select("#map-estados-container").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr('class', 'Reds');

        d3.json("resources/br-states.json", function(error, map_data)  {
        svg.selectAll('path')
            .data(topojson.feature(map_data,map_data.objects.states).features).enter().append('path')
            .attr('d',path)
            .attr('pointer-events', 'all')
            .attr('class', self.get_state_fill )
            .call(tip)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            
        });
    },
    draw_regioes: function() {
        var self = this;
        var height = 400;
        var width = 500;

        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d, i) {
            var estado = d.properties.name;
            var uf = ESTADOS[estado][1];
            var regiao = ESTADOS[estado][2];
            var name = REGIOES[regiao];
            var percent = Number(votos_por_regiao_normalizado[regiao]*100).toFixed(2);
            return "<strong>" + name + "</strong>: " +  "<span>" + percent + "% a favor do impeachment</span>";
          })

        var projection = d3.geo.albers()
          .center([-55,-10])
          .parallels( [12,-28])
          .scale(500)
          .rotate([50,-5,-5])
          .translate([width/2 - 470,height/2 -40]);

        var path = d3.geo.path().projection(projection);

        var svg = d3.select("#map-regiao-container").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr('class', 'Reds');

        d3.json("resources/br-states.json", function(error, map_data)  {
        svg.selectAll('path')
            .data(topojson.feature(map_data,map_data.objects.states).features).enter().append('path')
            .attr('d',path)
            .attr('pointer-events', 'all')
            .attr('class', self.get_regiao_fill)
            .call(tip)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
        });
    },
};

var TreeMap = {
    init: function() {
        var self = this;
        data = {
            'name': 'votos',
        };
        var children = [];
        _.each(['NORTE', 'NORDESTE', 'SUL', 'SUDESTE', 'CENTRO-OESTE'], function(regiao){
            var _data = {};
            _data['name'] = regiao;
            var arr = [];
            _.each(ESTADOS_POR_REGIAO[regiao], function(val) {
                arr.push({
                    'name': val[0], // Nome do estado
                    'size': votos_por_estado[val[1]]// Votos por estado
                })
            });
            _data['children'] = arr;
            children.push(_data);
        });
        data['children'] = children;
        self.data_a_favor = data;

        data = {
            'name': 'votos',
        };
        var children = [];
        _.each(['NORTE', 'NORDESTE', 'SUL', 'SUDESTE', 'CENTRO-OESTE'], function(regiao){
            var _data = {};
            _data['name'] = regiao;
            var arr = [];
            _.each(ESTADOS_POR_REGIAO[regiao], function(val) {
                arr.push({
                    'name': val[0], // Nome do estado
                    'size': max_votos_por_estado[val[1]] - votos_por_estado[val[1]]// Votos por estado
                })
            });
            _data['children'] = arr;
            children.push(_data);
        });
        data['children'] = children;
        self.data_contra = data;
    },
    draw_votos_favor: function() {
        var self = this;
        var el_id = '#treemap-favor';
        data = self.data_a_favor;
        self.draw_votos(el_id, data);
    },
    draw_votos_contra: function() {
        var self = this;
        var el_id = '#treemap-contra';
        data = self.data_contra;
        self.draw_votos(el_id, data);
    },
    draw_votos: function(el_id, data) {
        var self = this;
        var w = $(el_id).width(),
        h = 600,
        x = d3.scale.linear().range([0, w]),
        y = d3.scale.linear().range([0, h]),
        color = d3.scale.category20c(),
        root,
        node;

        var treemap = d3.layout.treemap()
        .round(false)
        .size([w, h])
        .sticky(true)
        .value(function(d) { return d.size; });

        var svg = d3.select(el_id).append("div")
        .attr("class", "chart")
        .style("width", w + "px")
        .style("height", h + "px")
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .append("svg:g")
        .attr("transform", "translate(.5,.5)");

        node = root = data;

        var nodes = treemap.nodes(root)
          .filter(function(d) { return !d.children; });

        var cell = svg.selectAll("g")
          .data(nodes)
          .enter().append("svg:g")
          .attr("class", "cell")
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
          .on("click", function(d) { return zoom(node == d.parent ? root : d.parent); });

        cell.append("svg:rect")
          .attr("width", function(d) { return d.dx - 1; })
          .attr("height", function(d) { return d.dy - 1; })
          .style("fill", function(d) { return color(d.parent.name); });

        cell.append("svg:text")
          .attr("x", function(d) { return d.dx / 2; })
          .attr("y", function(d) { return d.dy / 2; })
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .text(function(d) { return d.name; })
          .style("opacity", function(d) { d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0; });

        d3.select(window).on("click", function() { zoom(root); });

        d3.select("select").on("change", function() {
            treemap.value(this.value == "size" ? size : count).nodes(root);
            zoom(node);
        });

        function size(d) {
            return d.size;
        }

        function count(d) {
            return 1;
        }

        function zoom(d) {
            var kx = w / d.dx, ky = h / d.dy;
            x.domain([d.x, d.x + d.dx]);
            y.domain([d.y, d.y + d.dy]);

            var t = svg.selectAll("g.cell").transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

            t.select("rect")
            .attr("width", function(d) { return kx * d.dx - 1; })
            .attr("height", function(d) { return ky * d.dy - 1; })

            t.select("text")
            .attr("x", function(d) { return kx * d.dx / 2; })
            .attr("y", function(d) { return ky * d.dy / 2; })
            .style("opacity", function(d) { return kx * d.dx > d.w ? 1 : 0; });

            node = d;
            d3.event.stopPropagation();
        }
    }
};

var Hist = {
    draw: function() {
        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = $('#hist-partidos').width() - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);

        var svg = d3.select("#hist-partidos").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Votos a favor
        data = [];
        _.each(votos_por_partido, function(value, key){
            data.push({
                'name': key,
                'votos': value 
            });
        });
        data = _.sortBy(data, function(obj){
            return obj.votos * 1;
        });

          x.domain(data.map(function(d) { return d.name; }));
          y.domain([0, d3.max(data, function(d) { return d.votos; })]);

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Votos");

          svg.selectAll(".bar")
              .data(data)
              .enter().append("rect")
              .attr("class", "bar")
              .attr("x", function(d) { return x(d.name); })
              .attr("width", x.rangeBand())
              .attr("y", function(d) { return y(d.votos); })
              .attr("height", function(d) { return height - y(d.votos); });

        svg.selectAll("text.bar")
        .data(data)
        .enter().append("text")
        .attr("class", "bar")
        .attr("text-anchor", "middle")
        .attr("x", function(d) { return x(d.name) + 7; })
        .attr("y", function(d) { return y(d.votos) - 8; })
        .text(function(d) { return d.votos; });

        function type(d) {
          d.votos = +d.votos;
          return d;
        }
    },
}

var PESQUISA = {
    'NORTE': 58,
    'NORDESTE': 53,
    'CENTRO-OESTE': 71, 
    'SUDESTE': 73,
    'SUL': 71
}

var CorruptionMap = {
    get_state_fill: function(d, i) {
        var estado = d.properties.name;
        var uf = ESTADOS[estado][1];
        var quantize = d3.scale.quantile()
                         .domain([0, 1])
                         .range(d3.range(9));
        return "q" + quantize(corruptos_por_estado_normalizado[uf]) + "-9 state"; 
    },
    get_regiao_fill: function(d, i) {
        var regiao = d.properties.region;
        var quantize = d3.scale.quantile()
                         .domain([0, 1])
                         .range(d3.range(9));
        return "q" + quantize(corruptos_por_regiao_normalizado[regiao]) + "-9 state"; 
    },
    draw_states: function() {
        var self = this;
        var height = 400;
        var width = 500;

        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d, i) {
            var estado = d.properties.name;
            var uf = ESTADOS[estado][1];
            var name = ESTADOS[estado][0];
            var percent = Number(corruptos_por_estado_normalizado[uf]*100).toFixed(2);
            return "<strong>" + name + "</strong>: " +  "<span>" + percent + "% com algum processo criminal</span>";
          })

        var projection = d3.geo.albers()
          .center([-55,-10])
          .parallels( [12,-28])
          .scale(500)
          .rotate([50,-5,-5])
          .translate([width/2 - 470,height/2 -40]);

        var path = d3.geo.path().projection(projection);

        var svg = d3.select("#map-corr-estados-container").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr('class', 'Reds');

        d3.json("resources/br-states.json", function(error, map_data)  {
        svg.selectAll('path')
            .data(topojson.feature(map_data,map_data.objects.states).features).enter().append('path')
            .attr('d',path)
            .attr('pointer-events', 'all')
            .attr('class', self.get_state_fill )
            .call(tip)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
            
        });
    },
    draw_regioes: function() {
        var self = this;
        var height = 400;
        var width = 500;

        var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d, i) {
            var estado = d.properties.name;
            var uf = ESTADOS[estado][1];
            var regiao = ESTADOS[estado][2];
            var name = REGIOES[regiao];
            var percent = Number(corruptos_por_regiao_normalizado[regiao]*100).toFixed(2);
            return "<strong>" + name + "</strong>: " +  "<span>" + percent + "% com algum processo criminal</span>";
          })

        var projection = d3.geo.albers()
          .center([-55,-10])
          .parallels( [12,-28])
          .scale(500)
          .rotate([50,-5,-5])
          .translate([width/2 - 470,height/2 -40]);

        var path = d3.geo.path().projection(projection);

        var svg = d3.select("#map-corr-regiao-container").append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr('class', 'Reds');

        d3.json("resources/br-states.json", function(error, map_data)  {
        svg.selectAll('path')
            .data(topojson.feature(map_data,map_data.objects.states).features).enter().append('path')
            .attr('d',path)
            .attr('pointer-events', 'all')
            .attr('class', self.get_regiao_fill)
            .call(tip)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)
        });
    },
};

$(document).ready(function() {

    Data.init();

    Hist.draw();

    Map.draw_states(); Map.draw_regioes();

    TreeMap.init(); TreeMap.draw_votos_favor(); TreeMap.draw_votos_contra();

    CorruptionMap.draw_states(); CorruptionMap.draw_regioes();

});
