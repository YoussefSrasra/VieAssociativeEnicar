// chart-helper.service.ts
import { Injectable } from '@angular/core';

declare var Chart: any;

@Injectable({
  providedIn: 'root'
})
export class ChartHelperService {


 

  private adjustColor(color: string, amount: number): string {
    return '#' + color.replace(/^#/, '').replace(/../g,
      (colorPart: string) => {
        const value = parseInt(colorPart, 16) + amount;
        const adjusted = Math.min(255, Math.max(0, value)).toString(16);
        return adjusted.padStart(2, '0');
      });
  }



  createLineChart(ctx: any, labels: string[], data: number[], color: string) {
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          borderColor: color,
          backgroundColor: this.adjustColor(color, 20),
          fill: true,
          tension: 0.4,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createDoughnutChart(ctx: any, labels: string[], data: number[], colors: string[]) {
    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderColor: '#fff',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    });
  }
  createBarChart(canvas: HTMLCanvasElement, labels: string[], data: number[], colors: string[]) {
    return new Chart(canvas, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Événements',
                data: data,
                backgroundColor: colors,
                borderWidth: 1,
                barPercentage: 0.8,
                categoryPercentage: 0.9
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    },
                    title: {
                        display: true,
                        text: "Nombre d'événements"
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Mois'
                    }
                }
            }
        }
    });
}

// Helper pour assombrir les couleurs (optionnel)

createPieChart(canvas: HTMLCanvasElement, labels: string[], data: number[], colors?: string[]) {
  // Couleurs par défaut si non fournies
  const defaultColors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40'
  ];

  return new Chart(canvas, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors || defaultColors,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}
}
