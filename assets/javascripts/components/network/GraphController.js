define([
    'angular',
    'cytoscape',
    'cytoscape-edgehandles',
    'jquery',
    'ngCy'
], function(angular, cytoscape, edgehandles, $) {
    'use strict';
    /**
     * network graph module:
     * visualization and interaction of network graph
     */
    angular.module('autolinks.graph', ['ngCy']);
    angular.module('autolinks.graph')
        // Graph Controller
        .controller('GraphController', ['$scope', '$q', '$rootScope', 'graphProperties', 'EntityService', '_', '$mdDialog', '$mdToast', '$timeout',
        function ($scope, $q, $rootScope, graphProperties, EntityService, _, $mdDialog, $mdToast, $timeout) {

          var self = this;
          /* Background collection */
          self.nodes = [];
          self.edges = [];

          /* Graph collection filtered during runtime */
          self.nodesDataset = [];
          self.edgesDataset = [];

          $scope.graphOptions = graphProperties.options;

          $scope.graphEvents = {
              "onload": onNetworkLoad
          };

          function onNetworkLoad(cy) {
              self.cy = cy;
          }

          $scope.EntityService = EntityService;

          $scope.$mdDialog = $mdDialog;
          $scope.$mdToast = $mdToast;

          $scope.edgehandler = false;
          // container objects
          $scope.mapData = [];
          $scope.edgeData = [];
          // data types/groups object - used Cytoscape's shapes just to make it more clear
          $scope.objTypes = ['ellipse','triangle','rectangle','roundrectangle','pentagon','octagon','hexagon','heptagon','star'];


          $scope.buildGraph = function() {

              var promise = $q.defer();

              var nodes = [
                //mariaulfah
                { data: { id: 'mariaulfah', name: 'mariaulfah', desc: "Data Scientist AI/BI; Lufthansa's Artificial Intelligence Specialist", image: "https://mariaulf4h.github.io/assets/images/maria_foto_1.jpg" } },
                //working_exps
                { data: { id: 'working_exp', name: "Professional Positions" } },
                { data: { id: 'research_assistant', name: "Research Assistant", parent: 'working_exp', image: "https://mariaulf4h.github.io/assets/images/uni_hh.jpg", desc: "Worked on projects, new/s/leak 2.0 (Network of Searchable leaks), Science and Data-Driven Journalism tool http://www.newsleak.io/ and autolinks (automatic proactive researching) - https://uhh-lt.github.io/autolinks, under the supervision of Prof. Chris Biemann.\n \n Tech stack: Scala Play, AngularJS, NodeJS, Elasticsearch, Docker, PostgreSQL, Python, NLP components: UIMA, cTAKES, Polyglot-NER." } },
                { data: { id: 'data_scientist', name: "Data Scientist", parent: 'working_exp', image: "https://mariaulf4h.github.io/assets/images/data_science/ginkgo_analytics_200x70_rgb-1_small.png" }},
                { data: { id: 'full_stack_developer', name: "Full Stack Developer", parent: 'working_exp' }},
                { data: { id: 'ai_specialist', name: "AI Specialist", parent: 'working_exp', image: "https://mariaulf4h.github.io/assets/images/lhind.png" }},
                // { data: { id: 'full_stack_developer_1', name: "Full Stack Developer (ROR)", parent: 'full_stack_developer', image: "https://mariaulf4h.github.io/assets/images/hausgold.png", desc: "Worked on a project for building a maklerportal and CRM. Maklerportal-frontend Stack: ReactJS, SCSS, Webpack, E2E Test: NightwatchJS. Maklerportal-api Stack: Ruby on Rails, PostgreSQL.Container: Docker" } },
                // { data: { id: 'full_stack_developer_2', name: "Full Stack Developer (ROR)", parent: 'full_stack_developer', image: "https://mariaulf4h.github.io/assets/images/converate.jpeg", desc: "Developed features of several websites (ximmo, ubitricity, codetalk): HTML5, sass, Bootstrap, Javascript. Framework: Ruby on Rails, TDD/BDD: RSpec." } },
                // { data: { id: 'full_stack_developer_3', name: "Full Stack Developer (JS)", parent: 'full_stack_developer', image: "https://mariaulf4h.github.io/assets/images/quantilope.png", desc: "Developed a Market Research Software: MeteorJS, AngularJS, HTML5, LESS, Bootstrap, jQuery, and MongoDB." } },

                { data: { id: 'associate_developer', name: "Associate Developer (BI)", parent: 'working_exp', image: "https://mariaulf4h.github.io/assets/images/programming/wk.jpg", desc: "1. Researched on Information retrieval using Apache SOLR for company data indexing.\n \n 2. Implemented ETL (Extract Transform Load) and Business Intelligence Process via Microsoft BIDS (Business Intelligence Development Studio) using SSIS (SQL Server Integration Services)." } },
                //Education
                { data: { id: 'education', name: "Education" } },
                { data: { id: 'degree', name: "Degree", parent: 'education' } },
                { data: { id: 'non_degree', name: "Non degree", parent: 'education' } },
                { data: { id: 'msc', name: "Intelligent Adaptive Systems (M.Sc.)", parent: 'degree' } },
                { data: { id: 'bsc', name: "Computer Science (B.Sc.)", parent: 'degree' } },
                { data: { id: 'uin_jkt', name: "UIN Jakarta", parent: 'bsc', image: "https://mariaulf4h.github.io/assets/images/uin-jkt.jpeg", desc: "-Software Engineering. \n\n-Standards: \nGerman Grade: 1.42 (Cum laude) \nIndo/US Grade: 3.58 (Cum laude)" } },
                { data: { id: 'uni_hamburg', name: "Universität Hamburg", parent: 'msc', image: "https://mariaulf4h.github.io/assets/images/uni_hh.jpg", desc: "-Machine Learning\n-Natural Language Processing\n-Neural Networks/Deep Learning\n-Reinforcement Learning\n\nStandard: \nGerman Grade: 2.38 (Good)" } },
                { data: { id: 'uni_due', name: "Universität Duisburg-Essen", parent: 'non_degree', image: "https://mariaulf4h.github.io/assets/images/uni_due.png" } },
                { data: { id: 'dlai', name: "deeplearning.ai", parent: 'non_degree', image: "https://mariaulf4h.github.io/assets/images/dlai.jpeg" } },
                { data: { id: 'iium', name: "IIUM, Malaysia", parent: 'non_degree', image: "https://mariaulf4h.github.io/assets/images/iium.png", desc: "1-year study abroad program, majoring Information and Communication Technology.\n\n-Artificial Intelligence\n-Theory of Automata\n-Information Retrieval\nGerman Grade: 2.00 (Good) \nMalay/US Grade: 3.00 (Good)" } },
                // Technology Stack
                { data: { id: 'tech_stack', name: "Full Stack" } },

                { data: { id: 'fe_stack', name: "Front-End Stack", parent: "tech_stack" } },
                { data: { id: 'ui_frameworks', name: "UI Frameworks", parent: 'fe_stack' } },
                { data: { id: 'angularjs', name: "Angular", parent: 'ui_frameworks', image: "https://mariaulf4h.github.io/assets/images/programming/angular.png" } },
                { data: { id: 'reactjs', name: "React", parent: 'ui_frameworks', image: "https://mariaulf4h.github.io/assets/images/programming/react.png" } },
                { data: { id: 'meteor', name: "Meteor", parent: 'ui_frameworks', image: "https://mariaulf4h.github.io/assets/images/programming/meteor.png" } },

                { data: { id: 'fe_build_tools', name: "Build Tools", parent: 'fe_stack' } },
                { data: { id: 'webpack', name: "Webpack", parent: 'fe_build_tools', image: "https://mariaulf4h.github.io/assets/images/programming/webpack.png" } },

                { data: { id: 'package_managers', name: "Package Managers", parent: 'fe_stack' } },
                { data: { id: 'npm', name: "npm", parent: 'package_managers', image: "https://mariaulf4h.github.io/assets/images/programming/npm.png"} },
                { data: { id: 'bower', name: "Bower", parent: 'package_managers', image: "https://mariaulf4h.github.io/assets/images/programming/bower.jpeg"} },

                { data: { id: 'be_stack', name: "Back-End Stack", parent: "tech_stack" } },
                { data: { id: 'database', name: "Database", parent: 'be_stack' } },
                { data: { id: 'mongodb', name: "MongoDB", parent: 'database', image: "https://mariaulf4h.github.io/assets/images/programming/mongodb.png" } },
                { data: { id: 'mysql', name: "MySQL", parent: 'database', image: "https://mariaulf4h.github.io/assets/images/programming/mysql.png" } },
                { data: { id: 'postgre', name: "Postgre", parent: 'database', image: "https://mariaulf4h.github.io/assets/images/programming/postgresql.png" } },

                { data: { id: 'programming_languages', name: "Programming Languages", parent: 'be_stack' } },
                { data: { id: 'ruby', name: "Ruby", parent: 'programming_languages', image: "https://mariaulf4h.github.io/assets/images/programming/ruby.png" } },
                { data: { id: 'scala', name: "Scala", parent: 'programming_languages', image: "https://mariaulf4h.github.io/assets/images/programming/scala.png" } },
                { data: { id: 'python', name: "Python", parent: 'programming_languages', image: "https://mariaulf4h.github.io/assets/images/programming/python.png" } },
                { data: { id: 'java', name: "Java", parent: 'programming_languages', image: "https://mariaulf4h.github.io/assets/images/programming/java.png" } },
                { data: { id: 'nodejs', name: "NodeJs", parent: 'programming_languages', image: "https://mariaulf4h.github.io/assets/images/programming/nodejs.png" } },

                { data: { id: 'be_frameworks', name: "Frameworks", parent: 'be_stack' } },
                { data: { id: 'ror', name: "Ruby on Rails", parent: 'be_frameworks', image: "https://mariaulf4h.github.io/assets/images/programming/ROR.png"} },
                { data: { id: 'meteor_be', name: "Meteor", parent: 'be_frameworks', image: "https://mariaulf4h.github.io/assets/images/programming/meteor.png"} },
                { data: { id: 'scala_play', name: "Scala Play", parent: 'be_frameworks', image: "https://mariaulf4h.github.io/assets/images/programming/scala-play.png"} },

                { data: { id: 'be_build_tools', name: "Build Tools", parent: 'be_stack' } },
                { data: { id: 'maven', name: "Maven", parent: 'be_build_tools', image: "https://mariaulf4h.github.io/assets/images/programming/maven.png"} },
                { data: { id: 'scala_sbt', name: "Scala Sbt", parent: 'be_build_tools', image: "https://mariaulf4h.github.io/assets/images/programming/scala-sbt.png"} },

                { data: { id: 'api', name: "API", parent: 'be_stack' } },
                { data: { id: 'swagger', name: "Swagger", parent: 'api', image: "https://mariaulf4h.github.io/assets/images/programming/Swagger.png"} },


                { data: { id: 'ide', name: "IDE", parent: 'tech_stack' } },
                { data: { id: 'atom', name: "Atom", parent: 'ide', image: "https://mariaulf4h.github.io/assets/images/programming/atom.png" } },
                { data: { id: 'intellij', name: "IntelliJ", parent: 'ide', image: "https://mariaulf4h.github.io/assets/images/programming/intellij.jpeg" } },

                { data: { id: 'data_visualization', name: "Data Visualization", parent: 'tech_stack' } },
                { data: { id: 'd3', name: "D3", parent: 'data_visualization', image: "https://mariaulf4h.github.io/assets/images/programming/d3js.png"} },
                { data: { id: 'vis', name: "VisJs", parent: 'data_visualization', image: "https://mariaulf4h.github.io/assets/images/programming/visjs.png"} },
                { data: { id: 'cytoscape', name: "CytoscapeJS", parent: 'data_visualization', image: "https://mariaulf4h.github.io/assets/images/programming/cytoscape.svg"} },

                { data: { id: 'container', name: "Container", parent: 'tech_stack' } },
                { data: { id: 'docker', name: "Docker", parent: 'container', image: "https://mariaulf4h.github.io/assets/images/programming/docker.png" } },

                { data: { id: 'indexing', name: "Indexing", parent: 'tech_stack' } },
                { data: { id: 'elasticsearch', name: "Elasticsearch", parent: 'indexing', image: "https://mariaulf4h.github.io/assets/images/programming/elasticsearch.jpg" } },
                { data: { id: 'solr', name: "Solr", parent: 'indexing', image: "https://mariaulf4h.github.io/assets/images/programming/solr.png"} },

                // Data Science Stack
                { data: { id: 'data_science_stack', name: "Data Science Stack" } },
                { data: { id: "machine_learning", name: "Machine Learning", parent: 'data_science_stack'  } },
                { data: { id: "reinforcement_learning", name: "Reinforcement Learning", parent: 'machine_learning'  } },

                { data: { id: "interactive_reinforcement_learning", name: "Interactive RL (Agent Advising)", parent: 'reinforcement_learning'  } },
                { data: { id: "explorative_reinforcement_learning", name: "Explorative RL (Action Selection)", parent: 'reinforcement_learning'  } },

                { data: { id: "q_learning", name: "Q Learning", parent: 'explorative_reinforcement_learning'  } },
                { data: { id: "sarsa", name: "SARSA", parent: 'explorative_reinforcement_learning'  } },

                { data: { id: "mistake_correcting", name: "Mistake Correcting", parent: 'interactive_reinforcement_learning'  } },
                { data: { id: "early_advising", name: "Early Advising", parent: 'interactive_reinforcement_learning'  } },
                { data: { id: "importance_advising", name: "Importance Advising", parent: 'interactive_reinforcement_learning'  } },
                { data: { id: "probabilistic_advising", name: "Probabilistic Advising", parent: 'interactive_reinforcement_learning'  } },


                { data: { id: "supervised_learning", name: "Supervised Learning", parent: 'machine_learning'  } },
                { data: { id: "linear_regression", name: "Linear Regression", parent: 'supervised_learning'  } },
                { data: { id: "classification", name: "Classification", parent: 'supervised_learning'  } },
                { data: { id: "generative_learning_models", name: "Generative Learning Models", parent: 'supervised_learning'  } },
                { data: { id: "support_vector_machines", name: "Support Vector Machines", parent: 'supervised_learning'  } },
                { data: { id: "learning_theory", name: "Learning theory", parent: 'supervised_learning'  } },
                //{ data: { id: "nn", name: "Neural Network", parent: 'supervised_learning'  } },

                { data: { id: "deep_learning", name: "Deep Learning", parent: 'machine_learning'  } },
                { data: { id: "lstm", name: "LSTM", parent: 'deep_learning'  } },
                { data: { id: "cnn", name: "CNN", parent: 'deep_learning'  } },
                { data: { id: "dl_tools", name: "Tools", parent: 'deep_learning'  } },
                { data: { id: "tensorflow", name: "Tensorflow", parent: 'dl_tools', image: "https://mariaulf4h.github.io/assets/images/machine_learning/tensorflow.jpeg" } },
                { data: { id: "scikit_learn", name: "scikit-learn", parent: 'dl_tools', image: "https://mariaulf4h.github.io/assets/images/machine_learning/scikit-learn.png" } },
                { data: { id: "jupyter", name: "Jupyter", parent: 'dl_tools', image: "https://mariaulf4h.github.io/assets/images/machine_learning/jupyter.png" } },
                { data: { id: "keras", name: "Keras", parent: 'dl_tools', image: "https://mariaulf4h.github.io/assets/images/machine_learning/keras.png" } },
                { data: { id: "matplotlib", name: "matplotlib", parent: 'dl_tools', image: "https://mariaulf4h.github.io/assets/images/machine_learning/matplotlib.png" } },
                { data: { id: "numpy", name: "numpy", parent: 'dl_tools', image: "https://mariaulf4h.github.io/assets/images/machine_learning/numpy.png" } },
                { data: { id: "pandas", name: "pandas", parent: 'dl_tools'} },

                { data: { id: "unsupervised_learning", name: "Unsupervised Learning", parent: 'machine_learning'  } },
                { data: { id: "expectation_maximization", name: "Expectation Maximization", parent: 'unsupervised_learning'  } },
                { data: { id: "principal_component_analysis", name: "Principal Component Analysis", parent: 'unsupervised_learning'  } },
                { data: { id: "independent_component_analysis", name: "Independent Component Analysis", parent: 'unsupervised_learning'  } },

                { data: { id: "nlp", name: "Natural Language Processing", parent: 'data_science_stack'  } },
                { data: { id: 'uima', name: "UIMA", parent: 'nlp', image: "https://mariaulf4h.github.io/assets/images/data_science/uima.png" } },
                { data: { id: 'nltk', name: "NLTK", parent: 'nlp' } },
                { data: { id: 'ctakes', name: "cTakes", parent: 'nlp', image: "https://mariaulf4h.github.io/assets/images/programming/ctakes.png" } },

                { data: { id: "big_data", name: "Big Data", parent: 'data_science_stack'  } },
                { data: { id: "tools", name: "Tools", parent: 'data_science_stack'  } },
                { data: { id: "r_programming", name: "R", parent: 'tools', image: "https://mariaulf4h.github.io/assets/images/data_science/r-programming.png"  } },
                { data: { id: "r_studio", name: "R Studio", parent: 'tools', image: "https://mariaulf4h.github.io/assets/images/data_science/r-studio.png"  } },
                { data: { id: "matlab", name: "Matlab", parent: 'tools', image: "https://mariaulf4h.github.io/assets/images/data_science/matlab.gif"  } },
                { data: { id: "octave", name: "Octave", parent: 'tools', image: "https://mariaulf4h.github.io/assets/images/data_science/octave.jpeg"  } },
                { data: { id: "ggplot2", name: "ggplot2", parent: 'tools', image: "https://mariaulf4h.github.io/assets/images/data_science/ggplot2.png"  } },
                { data: { id: "shiny", name: "Rshiny", parent: 'tools', image: "https://mariaulf4h.github.io/assets/images/data_science/shiny.png"  } },
                { data: { id: "tidyverse", name: "tidyverse", parent: 'tools', image: "https://mariaulf4h.github.io/assets/images/data_science/tidyverse.jpg"  } },

                { data: { id: "ds_visualization", name: "Visualization", parent: 'data_science_stack'  } },
                { data: { id: "sap", name: "SAP", parent: 'data_science_stack'  } },

                { data: { id: 'projects', name: "Projects" } },
                { data: { id: 'newsleak', name: "New/s/leak 2.0", parent: 'projects', image: "https://mariaulf4h.github.io/assets/images/projects/newsleak.png", url: 'http://www.newsleak.io/', desc: "New/s/leak (NetWork of Searchable Leaks) is a research project producing a piece of software that allows to quickly and intuitively explore large amounts of textual data. The tool will support journalists working with datasets like the War Diaries or the Embassy cables (both distributed by Wikileaks) or the hacking of Hacking Team. The goal is to provide a quick access to important entities (people, organizations, places) and their relationships, and how those things change over time. \n \n Tech Stack: AngularJS, VIS.js, Scala, Play, Elasticsearch, PostgreSQL, Docker, NLP: UIMA, GermaNER, Python – PolyglotNER (new/s/leak 2.0)."  } },
                { data: { id: 'autolinks', name: "autolinks", parent: 'projects', image: "https://mariaulf4h.github.io/assets/images/projects/autolinks.png", url: 'https://uhh-lt.github.io/autolinks', desc: "Autolinks (Automatic Proactive Researching) is an approach to bottom-up biomedical information management that extracts biomedical entities in the document. It provides novel features in the information management to enable users to build a knowledge graph with compound graphs and discontinuous annotation implementation.\n\nTech Stack: AngularJS, Node.JS, Cytoscape.JS, MySQL, Swagger.io, NLP: cTAKES., "  } },
                { data: { id: 'irl', name: "Interactive RL", parent: 'projects', desc: "we review a number of proposed advising approaches for interactive reinforcement learning and discuss their implications, namely, probabilistic advising, early advising, importance advising, and mistake correcting. Moreover, we implement the advice strategies for interactive reinforcement learning based on a simulated robotic scenario of a domestic cleaning task. Tech stack: Python, numpy, matplotlib." } },
                { data: { id: 'erl', name: "Exploration RL", parent: 'projects', desc: "The project compares multiple approaches to the exploration/exploitation dilemma in reinforcement learning and, moreover, it implements an exemplary reinforcement learning task within the domain of domestic robotics to show the performance of different exploration policies on it. We perform the domestic task using e-greedy, softmax, VDBE, and VDBESoftmax with online and offline temporal-difference learning. Tech Stack: Python, numpy, matplotlib." } },
                { data: { id: 'hausgold_maklerportal', name: "Hausgold maklerportal", parent: 'projects', image: "https://mariaulf4h.github.io/assets/images/hausgold.png", desc: 'https://maklerportal.hausgold.de/'  } },
                { data: { id: 'quantilope_marktforschung', name: "Q_marktforschung", parent: 'projects' } },

                { data: { id: 'publications', name: "Publications" } },
                { data: { id: 'paper_irl', name: "Interactive RL", parent: 'publications', image: "https://mariaulf4h.github.io/assets/images/papers/interactive_RL.png", url: "https://ieeexplore.ieee.org/document/8329809", desc: "We review a number of proposed advising approaches for interactive reinforcement learning and discuss their implications, namely, probabilistic advising, early advising, importance advising, and mistake correcting. Moreover, we implement the advice strategies for interactive reinforcement learning based on a simulated robotic scenario of a domestic cleaning task. Tech stack: Python, numpy, matplotlib."} },
                { data: { id: 'paper_xrl', name: "Exploration RL", parent: 'publications', image: "https://mariaulf4h.github.io/assets/images/papers/exploration_RL.png", url: "https://ieeexplore.ieee.org/abstract/document/8625243", desc: "This paper compares multiple approaches to the exploration/exploitation dilemma in reinforcement learning and, moreover, it implements an exemplary reinforcement learning task within the domain of domestic robotics to show the performance of different exploration policies on it. We perform the domestic task using e-greedy, softmax, VDBE, and VDBESoftmax with online and offline temporal-difference learning. Tech Stack: Python, numpy, matplotlib." } },

                { data: { id: 'interests', name: "Interests" } },
                { data: { id: 'ai', name: "Artificial Intelligence", parent: 'interests' } },
                { data: { id: 'bi', name: "Business Intelligence", parent: 'interests' } },
                { data: { id: 'tw', name: "Teamwork", parent: 'interests' } },
                { data: { id: 'orga', name: "Organizational Activities", parent: 'interests' } },
                { data: { id: 'ps', name: "Public Speaking", parent: 'interests' } },
                { data: { id: 'futsal', name: "Futsal", parent: 'interests' } },
                { data: { id: 'swimming', name: "Swimming", parent: 'interests' } },

                { data: { id: 'languages', name: "Languages" } },
                { data: { id: 'ec1', name: "English - Expert", parent: 'languages' } },
                { data: { id: 'bahasa', name: "Bahasa(Indonesian) - Native", parent: 'languages' } },
                { data: { id: 'german', name: "German - Upper Intermediate", parent: 'languages' } },
                { data: { id: 'malay', name: "Malay - Expert", parent: 'languages' } },
                // { data: { id: '0', parent: 'b', name: "Disease" }, position: { x: 215, y: 85 } },
                // { data: { id: '1', name: "Caucasian race" } },
                // { data: { id: '2', name: 'B_CLL', desc: "type of leukemia (a type of cancer of the white blood cells)", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Chronic_lymphocytic_leukemia.jpg/1280px-Chronic_lymphocytic_leukemia.jpg" } },
                // { data: { id: '4', name: 'Antigen', parent: '8', desc: "In immunology, an antigen is a molecule capable of inducing an immune response on the part of the host organism", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Antibody.svg/255px-Antibody.svg.png" }, position: { x: 300, y: 85 } },
                // { data: { id: '5', name: "B-cell receptor", parent: '8', desc: " is a transmembrane receptor protein located on the outer surface of B cells", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Bcellreceptor.svg/251px-Bcellreceptor.svg.png" }, position: { x: 215, y: 175 } },
                // { data: { id: '6', name: "V(D)J recombination" } },
                // { data: { id: '7', name: "IgVH Mutation" }, position: { x: 300, y: 175 } },
                // { data: { id: '8', name: "BCR" }, position: { x: 300, y: 175 } },

              ];

              $scope.nodes = nodes;
              var edges = [
                // { data: { id: '20', source: '2', target: '0', name: 'is-a' } },
                // { data: { id: '21', source: '2', target: '1', name: 'affects' } },
                // { data: { id: '23', source: '2', target: 'mariaulfah', name: 'affects' } },
                // { data: { id: '53', source: '5', target: 'mariaulfah', name: 'part-of' } },
                // { data: { id: '54', source: '5', target: '4', name: 'binds' } },
                // { data: { id: '76', source: '7', target: '6', name: 'causes' } },
                // { data: { id: '65', source: '6', target: '5', name: 'affects' } },

                { data: { id: 'mariaulfahworking_exp', source: 'mariaulfah', target: 'working_exp', name: 'works' } },
                { data: { id: 'mariaulfaheducation', source: 'mariaulfah', target: 'education', name: 'studies' } },
                { data: { id: 'mariaulfahtech_stack', source: 'mariaulfah', target: 'tech_stack', name: 'has' } },
                { data: { id: 'mariaulfahpublications', source: 'mariaulfah', target: 'publications', name: 'writes' } },
                { data: { id: 'mariaulfahdata_science', source: 'mariaulfah', target: 'data_science_stack', name: 'has' } },
                { data: { id: 'mariaulfahactivities', source: 'mariaulfah', target: 'interests', name: 'has' } },
                { data: { id: 'mariaulfahlanguages', source: 'mariaulfah', target: 'languages', name: 'speaks' } },
                { data: { id: 'mariaulfahprojects', source: 'mariaulfah', target: 'projects', name: 'develops' } },

                { data: { id: 'associate_developerfull_stack_developer', source: 'associate_developer', target: 'full_stack_developer', name: 'to' } },
                // { data: { id: 'full_stack_developer_3full_stack_developer_2', source: 'full_stack_developer_3', target: 'full_stack_developer_2', name: 'to' } },
                // { data: { id: 'full_stack_developer_2full_stack_developer_1', source: 'full_stack_developer_2', target: 'full_stack_developer_1', name: 'to' } },
                { data: { id: 'full_stack_developerresearch_assistant', source: 'full_stack_developer', target: 'research_assistant', name: 'to' } },
                { data: { id: 'research_assistantdata_scientist', source: 'research_assistant', target: 'data_scientist', name: 'to' } },
                { data: { id: 'data_scientistai_specialist', source: 'data_scientist', target: 'ai_specialist', name: 'to' } },
                // { data: { id: 'nndeeplearning', source: 'nn', target: 'deep_learning', name: 'aka' } },
              ];

              var response = {data: {entities: nodes, relations: edges}};
              // // Enable physics for new graph data when network is initialized
              // if(!_.isUndefined(self.network)) {
              //     applyPhysicsOptions(self.physicOptions);
              // }

              $scope.loading = true;

              $scope.resultNodes = response.data.entities.map(function(n) {
                  var result = {};
                  if (n.data.parent) {
                    result = { data: { id: n.data.id, parent: n.data.parent, name: n.data.name }};
                  } else {
                    result = { data: { id: n.data.id, name: n.data.name }};
                  }

                  if (n.position) {
                    result['position'] = { x: n.position.x, y: n.position.y }
                  }

                  if(n.data.image){
                    result['data'].image = n.data.image;
                  }

                  if(n.data.desc){
                    result['data'].desc = n.data.desc;
                  }

                  if(n.data.url){
                    result['data'].url = n.data.url;
                  }

                  return result;
              });

              self.nodesDataset = [];
              self.nodesDataset.push($scope.resultNodes);

              self.nodes = [];

              $scope.resultRelations = response.data.relations.map(function(n) {
                  return {  data: { id: n.data.id, source: n.data.source, target: n.data.target, name: n.data.name } };
              });

              self.edges = [];
              self.edgesDataset = [];
              self.edgesDataset.push($scope.resultRelations);

              // Initialize the graph
              $scope.graphData = {
                  nodes: self.nodesDataset[0],
                  edges: self.edgesDataset[0]
              };
              return promise.promise;
          };

          $scope.reloadGraph = function () {
              clearGraph();
              $scope.buildGraph();
                $timeout( function() {
                  $scope.progressBarIsInactive = true;
                  $rootScope.$emit('progressBarIsInactive');
                }, 1000);
          };

          function clearGraph() {

              var promise = $q.defer();
              //
              // if(!_.isUndefined(self.network)) {
              //     applyPhysicsOptions(self.physicOptions);
              // }
              //
              // self.nodes.clear();
              // self.nodesDataset.clear();
              //
              // self.edges.clear();
              // self.edgesDataset.clear();
              //
              // // Initialize the graph
              // $scope.graphData = {
              //     nodes: self.nodesDataset,
              //     edges: self.edgesDataset
              // };

              return promise.promise;
          }

          function init() {
              $scope.reloadGraph();
          }

          // Init the network modulegit
          init();

          // add object from the form then broadcast event which triggers the directive redrawing of the chart
          // you can pass values and add them without redrawing the entire chart, but this is the simplest way
          $scope.addObj = function(){
              // collecting data from the form
              // debugger;
              var newObj = $scope.form.obj.name;
              var newObjType = $scope.form.obj.objTypes;
              // building the new Node object
              // using the array length to generate an id for the sample (you can do it any other way)
              var newNode = {id:'n'+($scope.mapData.length), name:newObj, type:newObjType};
              // adding the new Node to the nodes array
              $scope.mapData.push(newNode);
              // broadcasting the event
              $rootScope.$broadcast('appChanged');
              // resetting the form
              $scope.form.obj = {};
          };

          // add Edges to the edges object, then broadcast the change event
          $scope.addEdge = function(){
              // collecting the data from the form
              var edge1 = $scope.formEdges.fromName.id;
              var edge2 = $scope.formEdges.toName.id;
              // building the new Edge object from the data
              // using the array length to generate an id for the sample (you can do it any other way)
              var newEdge = {id:'e'+($scope.edgeData.length), source: edge1, target: edge2};
              // adding the new edge object to the adges array
              $scope.edgeData.push(newEdge);
              // broadcasting the event
              $rootScope.$broadcast('appChanged');
              // resetting the form
              $scope.formEdges = '';
          };

          // add Edges with edgehandler
          $scope.activateEdgeHandle = function(){
            $scope.edgehandler = true;
            // self.cy.edgehandles(defaults);
            $scope.reset();
          };

          $scope.disableEdgeHandle = function(){
            $scope.edgehandler = false;
            $scope.reset();
          };

          // delete a node
          $scope.delObj = function(){
            if (self.cy.$(":selected").length > 0) {
                self.cy.$(":selected").remove();
            }
          }

          $scope.centerGraph = function() {
            self.cy.fit();
          };

          // sample function to be called when clicking on an object in the chart
          $scope.doClick = function(value)
          {
              // sample just passes the object's ID then output it to the console and to an alert
              console.debug(value);
              alert(value);
          };

          // reset the sample nodes
          $scope.reset = function(){
              $scope.mapData = [];
              $scope.edgeData = [];
              $rootScope.$broadcast('appChanged');
          }
        }
    ]);
});
