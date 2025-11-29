import BaseApiService from '../services/api/baseApi'

class PortfolioService extends BaseApiService {
  async getPortfolio(professionalId) {
    const data = await this.get(`/portfolio/${professionalId}`, true, 5 * 60 * 1000)
    return this.handleResponse(data, 'Failed to fetch portfolio')
  }

  async savePortfolio(portfolioData) {
    const data = await this.post('/portfolio', portfolioData)
    return this.handleResponse(data, 'Failed to save portfolio')
  }

  async updatePortfolio(portfolioId, portfolioData) {
    const data = await this.put(`/portfolio/${portfolioId}`, portfolioData)
    return this.handleResponse(data, 'Failed to update portfolio')
  }

  async deletePortfolio(portfolioId) {
    const data = await this.delete(`/portfolio/${portfolioId}`)
    return this.handleResponse(data, 'Failed to delete portfolio')
  }

  async getPublicPortfolio(slug) {
    const data = await this.get(`/portfolio/public/${slug}`, true, 10 * 60 * 1000)
    return this.handleResponse(data, 'Portfolio not found')
  }

  async uploadPortfolioMedia(files) {
    const formData = new FormData()
    files.forEach(file => formData.append('media', file))
    
    const data = await this.http.upload('/portfolio/media', formData)
    return this.handleResponse(data, 'Failed to upload media')
  }

  async deletePortfolioMedia(mediaId) {
    const data = await this.delete(`/portfolio/media/${mediaId}`)
    return this.handleResponse(data, 'Failed to delete media')
  }

  generatePortfolioUrl(professional) {
    const slug = `${professional.firstName}-${professional.lastName}`.toLowerCase().replace(/\s+/g, '-')
    return `/portfolio/${slug}`
  }
}

export default new PortfolioService()