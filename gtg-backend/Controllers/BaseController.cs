using AutoMapper;
using gtg_backend.Data;
using gtg_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace gtg_backend.Controllers;
[Authorize]
[ApiController]
[Route("[controller]")]
public class BaseController<TEntity, TEntityDto> : ControllerBase 
    where TEntity : ModelBase
    where TEntityDto : class
{
    protected readonly GameDbContext _context;
    protected readonly IMapper _mapper;
    protected readonly DbSet<TEntity> _dbSet;

    public BaseController(GameDbContext context, IMapper mapper, DbSet<TEntity> dbSet)
    {
        _context = context;
        _mapper = mapper;
        _dbSet = dbSet;
        //Todo: temporary solution needs to be changed later
        context.Database.EnsureCreated();
    }

    [HttpGet]
    public virtual async Task<IActionResult> GetAll()
    {
        List<TEntity>? itemList = await _dbSet.ToListAsync();
        List<TEntityDto>? dtoList = _mapper.Map<List<TEntityDto>>(itemList);
        
        return Ok(dtoList);
    }

    [HttpGet("{id}")]
    public virtual async Task<IActionResult> GetById(Guid id)
    {
        TEntity? item = await _dbSet.FindAsync(id);
        if (item == null)
        {
            return NotFound();
        }
        TEntityDto? itemDto = _mapper.Map<TEntityDto>(item);
        return Ok(itemDto);
    }
    
    [HttpPost]
    public virtual async Task<IActionResult> CreateItem([FromBody]TEntityDto? itemDto)
    {
        if (itemDto == null)
        {
            return BadRequest();
        }
        TEntity? item = _mapper.Map<TEntity>(itemDto);
        item.Id = Guid.NewGuid();
        EntityEntry<TEntity> entity = _dbSet.Add(item);
        await _context.SaveChangesAsync();  
        TEntityDto entityDto = _mapper.Map<TEntityDto>(entity.Entity);
        return Ok(entityDto);
    }
    
    [HttpPut]
    public virtual async Task<IActionResult> UpdateItem([FromBody]TEntityDto? itemDto)
    {
        if (itemDto == null)
        {
            return BadRequest();
        }
        TEntity? item = _mapper.Map<TEntity>(itemDto);
        _dbSet.Update(item);
        await _context.SaveChangesAsync();
        return Ok(itemDto);
    }
    
    [HttpDelete("{id}")]
    public virtual async Task<IActionResult> DeleteItem(Guid id)
    {
        TEntity? item = await _dbSet.FindAsync(id);
        if (item == null)
        {
            return NotFound();
        }
        _dbSet.Remove(item);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("showDeleted")]
    public virtual async Task<IActionResult> GetSoftDeletedItems()
    {
        var deletedItems = await _dbSet
            .IgnoreQueryFilters()
            .Where(p => p.IsDeleted)
            .ToListAsync();
        
        return Ok(deletedItems);
    }
    
    //Todo: Add Restore SoftDeletedRecord
    // var product = dbContext.Products
    //         .IgnoreQueryFilters()
    //         .FirstOrDefault(p => p.Id == id && p.IsDeleted);
    //     if (product != null)
    // {
    //     product.IsDeleted = false;
    //     product.DeletedAt = null;
    //     product.UpdatedAt = DateTime.UtcNow;
    //     dbContext.SaveChanges();
    // }
    //Todo: alternative / implementation from Todo above:
    // [HttpPost("products/{id}/restore")]
    // public IActionResult Restore(Guid id)
    // {
    //     var product = _context.Products
    //         .IgnoreQueryFilters()
    //         .FirstOrDefault(p => p.Id == id && p.IsDeleted);
    //     if (product == null) return NotFound();
    //     product.IsDeleted = false;
    //     product.DeletedAt = null;
    //     product.UpdatedAt = DateTime.UtcNow;
    //     _context.SaveChanges();
    //     return Ok(product);
    // }
    
    //Todo: Permanent delete:
    // var product = dbContext.Products
    //         .IgnoreQueryFilters()
    //         .FirstOrDefault(p => p.Id == id);
    //     if (product != null)
    // {
    //     dbContext.Products.Remove(product);
    //     dbContext.SaveChanges();
    // }

}