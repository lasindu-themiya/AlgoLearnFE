import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  List, 
  Layers, 
  CircleDot,
  Database,
  Play,
  Users,
  Star,
  Search,
  TrendingUp,
  BarChart3,
  Zap,
  Target,
  Brain,
  Code,
  Trophy,
  Clock,
  CheckCircle,
  Github,
  BookOpen,
  Lightbulb,
  Activity,
  Shuffle,
  ArrowUpDown,
  Eye,
  Timer,
  GitCompare,
  RotateCw
} from 'lucide-react';
import { Button } from '../components/ui';

/**
 * Modern Landing Page Component
 * Interactive and animated landing page with dashboard-style elements
 */
export const LandingPage: React.FC = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 9); // Now cycles through 9 items (3 DS + 6 Algorithms)
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const dataStructures = [
    {
      icon: <List className="h-8 w-8" />,
      title: 'Linked Lists',
      description: 'Master dynamic data structures with pointer visualization',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-500/10 to-blue-600/10',
      operations: ['Insert', 'Delete', 'Traverse', 'Search'],
      complexity: 'O(n)'
    },
    {
      icon: <Layers className="h-8 w-8" />,
      title: 'Stacks',
      description: 'Understand LIFO operations with real-time animations',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-500/10 to-purple-600/10',
      operations: ['Push', 'Pop', 'Peek', 'isEmpty'],
      complexity: 'O(1)'
    },
    {
      icon: <CircleDot className="h-8 w-8" />,
      title: 'Queues',
      description: 'Explore FIFO operations with interactive visualizations',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-500/10 to-green-600/10',
      operations: ['Enqueue', 'Dequeue', 'Front', 'isEmpty'],
      complexity: 'O(1)'
    }
  ];

  // Combined array for dashboard showcase
  const allFeatures = [
    ...dataStructures,
    {
      icon: <Search className="h-8 w-8" />,
      title: 'Linear Search',
      description: 'Step-by-step element searching with comparison visualization',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'from-teal-500/10 to-teal-600/10',
      operations: ['Compare', 'Found', 'Next', 'Result'],
      complexity: 'O(n)'
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Bubble Sort',
      description: 'Watch elements bubble up with animated comparisons',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-500/10 to-orange-600/10',
      operations: ['Compare', 'Swap', 'Bubble', 'Sorted'],
      complexity: 'O(n²)'
    },
    {
      icon: <Shuffle className="h-8 w-8" />,
      title: 'Optimized Bubble Sort',
      description: 'Enhanced bubble sort with early termination detection',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-500/10 to-purple-600/10',
      operations: ['Compare', 'Flag', 'Optimize', 'Early Stop'],
      complexity: 'O(n) best'
    },
    {
      icon: <GitCompare className="h-8 w-8" />,
      title: 'Selection Sort',
      description: 'Find minimum element and place at correct position',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-500/10 to-blue-600/10',
      operations: ['Find Min', 'Select', 'Swap', 'Progress'],
      complexity: 'O(n²)'
    },
    {
      icon: <RotateCw className="h-8 w-8" />,
      title: 'Insertion Sort',
      description: 'Insert elements into their correct sorted position',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-500/10 to-emerald-600/10',
      operations: ['Insert', 'Shift', 'Place', 'Sorted'],
      complexity: 'O(n²)'
    },
    {
      icon: <ArrowUpDown className="h-8 w-8" />,
      title: 'Min Sort',
      description: 'Find minimum element and move to front position',
      color: 'from-rose-500 to-pink-600',
      bgColor: 'from-rose-500/10 to-pink-600/10',
      operations: ['Find Min', 'Move', 'Position', 'Next'],
      complexity: 'O(n²)'
    }
  ];

  const features = [
    {
      icon: <Brain className="h-12 w-12" />,
      title: 'Visual Learning',
      description: 'Watch algorithms come to life with smooth animations and step-by-step breakdowns',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: <Code className="h-12 w-12" />,
      title: 'Interactive Coding',
      description: 'Practice with real code examples and see immediate visual feedback',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: <Target className="h-12 w-12" />,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed session history and analytics',
      color: 'from-amber-500 to-amber-600'
    },
    {
      icon: <Zap className="h-12 w-12" />,
      title: 'Real-time Execution',
      description: 'Execute algorithms in real-time and observe performance characteristics',
      color: 'from-emerald-500 to-emerald-600'
    }
  ];

  const stats = [
    { icon: <Database className="h-8 w-8" />, label: 'Data Structures', value: '2+', color: 'text-blue-400' },
    { icon: <BarChart3 className="h-8 w-8" />, label: 'Algorithms', value: '7+', color: 'text-green-400' },
    { icon: <Activity className="h-8 w-8" />, label: 'Animations', value: '100%', color: 'text-purple-400' },
    { icon: <Trophy className="h-8 w-8" />, label: 'Success Rate', value: '95%', color: 'text-amber-400' }
  ];

  return (
    <div className="min-h-screen bg-dark-950 overflow-x-hidden">
      {/* Modern Navigation with Glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/30 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gradient-to-br from-teal-500 via-teal-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-teal-500/25 animate-pulse">
                <Database className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  AlgoPulse
                </span>
                <div className="text-xs text-gray-400 -mt-1">Interactive Learning Platform</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/signin">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10 px-6 py-2 backdrop-blur-sm border border-transparent hover:border-white/20 transition-all duration-300">
                  Sign in
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 hover:from-teal-700 hover:via-teal-600 hover:to-cyan-600 text-white px-6 py-2 shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 transition-all duration-300 transform hover:scale-105">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Dashboard Preview */}
      <section className={`relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 backdrop-blur-sm border border-teal-500/30 rounded-full px-6 py-3 mb-8 animate-bounce">
              <Lightbulb className="h-5 w-5 text-teal-400" />
              <span className="text-teal-300 font-medium">Interactive Algorithm Visualization</span>
            </div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-gray-100 mb-8 leading-tight">
              Master Algorithms
              <span className="block bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent mt-4 animate-pulse">
                Through Visualization
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
              Transform your understanding of data structures and algorithms with interactive visualizations, 
              real-time animations, and comprehensive learning tools designed for modern developers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link to="/signup">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 hover:from-teal-700 hover:via-teal-600 hover:to-cyan-600 text-white px-12 py-6 text-xl font-semibold shadow-2xl shadow-teal-500/30 transform hover:scale-105 transition-all duration-300 rounded-2xl"
                >
                  <Play className="mr-3 h-6 w-6" />
                  Start Learning Now
                </Button>
              </Link>
              <Link to="/signin">
                <Button 
                  variant="ghost" 
                  size="lg"
                  className="border-2 border-gray-500/50 bg-white/5 text-gray-300 hover:border-teal-400/50 hover:bg-teal-400/10 hover:text-teal-300 px-12 py-6 text-xl font-semibold transform hover:scale-105 transition-all duration-300 backdrop-blur-sm rounded-2xl"
                >
                  <BookOpen className="mr-3 h-6 w-6" />
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>

          {/* Mini Dashboard Preview */}
          <div className="relative max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-dark-900/60 via-dark-800/40 to-dark-900/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                  <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-400">AlgoPulse Dashboard Preview</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {allFeatures.slice(0, 3).map((_, index) => {
                  const isActive = index === currentFeature % 3;
                  const actualIndex = (currentFeature + index) % allFeatures.length;
                  const displayFeature = allFeatures[actualIndex];
                  
                  // Algorithm-specific animation class
                  const getAlgorithmAnimation = (title: string) => {
                    switch(title) {
                      case 'Bubble Sort': return 'animate-bubble-sort';
                      case 'Optimized Bubble Sort': return 'animate-bubble-sort';
                      case 'Linear Search': return 'animate-linear-search';
                      case 'Selection Sort': return 'animate-quick-sort'; // Reusing quick-sort animation for selection
                      case 'Insertion Sort': return 'animate-merge-sort'; // Reusing merge-sort animation for insertion
                      case 'Min Sort': return 'animate-quick-sort'; // Similar to selection sort animation
                      case 'Binary Search': return 'animate-binary-search';
                      default: return isActive ? 'animate-bounce' : '';
                    }
                  };
                  
                  return (
                    <div 
                      key={index}
                      className={`bg-gradient-to-br ${displayFeature.bgColor} border border-gray-600/30 rounded-2xl p-6 transform transition-all duration-500 hover:scale-105 hover:border-gray-500/50 ${
                        isActive ? 'ring-2 ring-teal-500/50 shadow-lg shadow-teal-500/20 animate-glow' : ''
                      }`}
                    >
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${displayFeature.color} shadow-lg mb-4`}>
                        <div className={`text-white ${getAlgorithmAnimation(displayFeature.title)}`}>
                          {displayFeature.icon}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{displayFeature.title}</h3>
                      <p className="text-gray-400 text-sm mb-4">{displayFeature.description}</p>
                      <div className="flex justify-between items-center">
                        <div className={`text-xs font-mono ${isActive ? 'text-teal-300' : 'text-gray-500'}`}>
                          {displayFeature.complexity}
                        </div>
                        <div className="flex space-x-1">
                          {displayFeature.operations.slice(0, 2).map((op, i) => (
                            <span key={i} className={`text-xs px-2 py-1 rounded transition-all duration-300 ${
                              isActive ? 'bg-teal-500/20 text-teal-300 animate-pulse' : 'bg-gray-700/50 text-gray-400'
                            }`}>{op}</span>
                          ))}
                        </div>
                      </div>
                      
                      {isActive && (
                        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-bounce">
                          Active
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-teal-600/15 via-cyan-600/10 to-blue-600/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-amber-600/10 to-orange-600/10 rounded-full blur-3xl animate-float"></div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-dark-900/60 via-dark-800/40 to-dark-900/60 backdrop-blur-sm border-y border-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-100 mb-4">
              Trusted by Learners Worldwide
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join thousands of students, developers, and professionals mastering algorithms through our interactive platform
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center group bg-gradient-to-br from-dark-800/40 to-dark-900/60 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8 hover:border-gray-600/50 transform hover:scale-105 transition-all duration-300"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 mb-6 group-hover:scale-110 transition-transform duration-300 ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-200">
                  {stat.value}
                </div>
                <div className="text-base text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Modern Cards */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-full px-6 py-3 mb-8">
              <Star className="h-5 w-5 text-emerald-400" />
              <span className="text-emerald-300 font-medium">Premium Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-6">
              Everything You Need to 
              <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Excel in Programming
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive platform provides all the tools and resources you need to master 
              data structures and algorithms through interactive learning.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="relative group bg-gradient-to-br from-dark-900/60 via-dark-800/40 to-dark-900/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 hover:border-gray-600/50 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600/5 via-transparent to-cyan-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-100 mb-4 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-lg group-hover:text-gray-300 transition-colors">
                    {feature.description}
                  </p>
                </div>
                
                {/* Decorative corner element */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-full blur-xl group-hover:bg-gradient-to-br group-hover:from-teal-500/20 group-hover:to-cyan-500/20 transition-all duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-900/30 via-dark-900/50 to-purple-900/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 via-transparent to-purple-600/10"></div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-500/20 to-purple-500/20 backdrop-blur-sm border border-teal-500/30 rounded-full px-6 py-3 mb-8">
            <Clock className="h-5 w-5 text-teal-400" />
            <span className="text-teal-300 font-medium">Start Your Journey Today</span>
          </div>
          
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-100 mb-8">
            Ready to Transform Your 
            <span className="block bg-gradient-to-r from-teal-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
              Programming Skills?
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of successful developers who have mastered algorithms and data structures 
            through our interactive visualization platform. Start your learning journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link to="/signup">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 hover:from-teal-700 hover:via-teal-600 hover:to-cyan-600 text-white px-12 py-6 text-xl font-semibold shadow-2xl shadow-teal-500/30 transform hover:scale-105 transition-all duration-300 rounded-2xl"
              >
                <Users className="mr-3 h-6 w-6" />
                Join 10,000+ Learners
              </Button>
            </Link>
            <Link to="/signin">
              <Button 
                variant="ghost" 
                size="lg"
                className="border-2 border-gray-500/50 bg-white/5 text-gray-300 hover:border-purple-400/50 hover:bg-purple-400/10 hover:text-purple-300 px-12 py-6 text-xl font-semibold transform hover:scale-105 transition-all duration-300 backdrop-blur-sm rounded-2xl"
              >
                <Github className="mr-3 h-6 w-6" />
                View on GitHub
              </Button>
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center space-x-2 text-gray-400">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Free to get started</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span>Instant access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Algorithms Showcase Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-3 mb-8">
              <RotateCw className="h-5 w-5 text-purple-400 animate-spin" />
              <span className="text-purple-300 font-medium">Algorithm Mastery</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-6">
              Master Search & Sort 
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                Algorithms Visually
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Watch algorithms come alive through stunning visualizations. From linear search to complex sorting, 
              understand every step with interactive animations and real-time performance analysis.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Search Algorithms */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-dark-900/80 via-dark-800/60 to-dark-900/80 backdrop-blur-xl border border-teal-500/30 rounded-3xl p-8 hover:border-teal-500/50 transition-all duration-300">
                <div className="flex items-center mb-8">
                  <div className="h-16 w-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl mr-6 group-hover:scale-110 transition-transform duration-300">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white">Search Algorithms</h3>
                    <p className="text-teal-300">Find elements efficiently</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-800/20 to-cyan-800/20 rounded-xl border border-teal-500/20 hover:border-teal-500/40 transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 shadow-sm">
                        <Eye className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Linear Search</h4>
                        <p className="text-sm text-teal-200">Sequential element comparison</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-teal-300 font-mono text-sm">O(n)</div>
                      <div className="text-xs text-gray-400">Time Complexity</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-800/20 to-blue-800/20 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 shadow-sm">
                        <GitCompare className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Binary Search</h4>
                        <p className="text-sm text-cyan-200">Divide and conquer approach</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-cyan-300 font-mono text-sm">O(log n)</div>
                      <div className="text-xs text-gray-400">Time Complexity</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Link to="/searching" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white">
                      <Search className="mr-2 h-4 w-4" />
                      Try Searching
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sorting Algorithms */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-dark-900/80 via-dark-800/60 to-dark-900/80 backdrop-blur-xl border border-orange-500/30 rounded-3xl p-8 hover:border-orange-500/50 transition-all duration-300">
                <div className="flex items-center mb-8">
                  <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl mr-6 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white">Sorting Algorithms</h3>
                    <p className="text-orange-300">Organize data systematically</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-800/20 to-red-800/20 rounded-xl border border-orange-500/20 hover:border-orange-500/40 transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 shadow-sm">
                        <ArrowUpDown className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Bubble Sort</h4>
                        <p className="text-sm text-orange-200">Adjacent element swapping</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-orange-300 font-mono text-sm">O(n²)</div>
                      <div className="text-xs text-gray-400">Time Complexity</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-800/20 to-pink-800/20 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 shadow-sm">
                        <Shuffle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Optimized Bubble Sort</h4>
                        <p className="text-sm text-purple-200">Early termination optimization</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-purple-300 font-mono text-sm">O(n) best</div>
                      <div className="text-xs text-gray-400">Best Case</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-800/20 to-indigo-800/20 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm">
                        <GitCompare className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Selection Sort</h4>
                        <p className="text-sm text-blue-200">Find minimum and swap</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-300 font-mono text-sm">O(n²)</div>
                      <div className="text-xs text-gray-400">Time Complexity</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-800/20 to-teal-800/20 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 shadow-sm">
                        <RotateCw className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Insertion Sort</h4>
                        <p className="text-sm text-emerald-200">Insert into sorted portion</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-300 font-mono text-sm">O(n²)</div>
                      <div className="text-xs text-gray-400">Time Complexity</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-800/20 to-pink-800/20 rounded-xl border border-rose-500/20 hover:border-rose-500/40 transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-600 shadow-sm">
                        <ArrowUpDown className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Min Sort</h4>
                        <p className="text-sm text-rose-200">Find minimum and move to front</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-rose-300 font-mono text-sm">O(n²)</div>
                      <div className="text-xs text-gray-400">Time Complexity</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Link to="/sorting" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Try Sorting
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Algorithm Animation Demo */}
          <div className="relative">
            <div className="bg-gradient-to-br from-dark-900/60 via-dark-800/40 to-dark-900/60 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 overflow-hidden">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">See Algorithms in Action</h3>
                <p className="text-gray-400">Watch how data moves and transforms in real-time</p>
              </div>
              
              {/* Animated Array Visualization */}
              <div className="flex justify-center items-end space-x-2 mb-6">
                {[64, 34, 25, 12, 22, 11, 90].map((value, index) => {
                  const heightClasses = ['bar-height-85', 'bar-height-45', 'bar-height-33', 'bar-height-16', 'bar-height-29', 'bar-height-15', 'bar-height-120'];
                  const delayClasses = ['delay-0', 'delay-200', 'delay-400', 'delay-600', 'delay-800', 'delay-1000', 'delay-1200'];
                  return (
                    <div 
                      key={index}
                      className={`bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg transition-all duration-1000 flex items-end justify-center text-white font-bold text-sm pb-2 animate-pulse w-15 ${heightClasses[index]} ${delayClasses[index]}`}
                    >
                      {value}
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Timer className="h-4 w-4 text-teal-400" />
                  <span>Real-time execution</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Eye className="h-4 w-4 text-cyan-400" />
                  <span>Step-by-step visualization</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <BarChart3 className="h-4 w-4 text-purple-400" />
                  <span>Performance tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-dark-900 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-12 w-12 bg-gradient-to-br from-teal-500 via-teal-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-teal-500/25">
                  <Database className="h-7 w-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                    AlgoPulse
                  </span>
                  <div className="text-sm text-gray-400 -mt-1">Interactive Learning Platform</div>
                </div>
              </div>
              
              <p className="text-gray-400 leading-relaxed max-w-md mb-6">
                Master data structures and algorithms through interactive visualizations designed for modern developers.
                Transform complex concepts into visual understanding.
              </p>
              
              <div className="flex space-x-4">
                <div className="p-3 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <Github className="h-5 w-5 text-gray-400 hover:text-white" />
                </div>
                <div className="p-3 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <BookOpen className="h-5 w-5 text-gray-400 hover:text-white" />
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/signup" className="text-gray-400 hover:text-teal-400 transition-colors">Get Started</Link></li>
                <li><Link to="/signin" className="text-gray-400 hover:text-teal-400 transition-colors">Sign In</Link></li>
                <li><span className="text-gray-400 hover:text-teal-400 transition-colors cursor-pointer">Features</span></li>
                <li><span className="text-gray-400 hover:text-teal-400 transition-colors cursor-pointer">Pricing</span></li>
              </ul>
            </div>
            
            {/* Learning */}
            <div>
              <h4 className="text-white font-semibold mb-4">Learn</h4>
              <ul className="space-y-2">
                <li><span className="text-gray-400 hover:text-teal-400 transition-colors cursor-pointer">Data Structures</span></li>
                <li><span className="text-gray-400 hover:text-teal-400 transition-colors cursor-pointer">Algorithms</span></li>
                <li><span className="text-gray-400 hover:text-teal-400 transition-colors cursor-pointer">Tutorials</span></li>
                <li><span className="text-gray-400 hover:text-teal-400 transition-colors cursor-pointer">Examples</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-base text-gray-400 mb-4 md:mb-0">
                © 2025 AlgoPulse. Built for interactive learning and algorithmic mastery.
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span className="hover:text-teal-400 transition-colors cursor-pointer">Privacy Policy</span>
                <span className="hover:text-teal-400 transition-colors cursor-pointer">Terms of Service</span>
                <span className="hover:text-teal-400 transition-colors cursor-pointer">Contact</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};