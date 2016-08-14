package com.opopz.mgmt.data.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * CoWorld generated by hbm2java
 */
@Entity
@Table(name = "co_world", catalog = "co")
public class CoWorld implements java.io.Serializable
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Integer rowid;
	private Integer id;
	private String world;

	public CoWorld()
	{
	}

	public CoWorld(Integer id, String world)
	{
		this.id = id;
		this.world = world;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)

	@Column(name = "rowid", unique = true, nullable = false)
	public Integer getRowid()
	{
		return this.rowid;
	}

	public void setRowid(Integer rowid)
	{
		this.rowid = rowid;
	}

	@Column(name = "id")
	public Integer getId()
	{
		return this.id;
	}

	public void setId(Integer id)
	{
		this.id = id;
	}

	@Column(name = "world")
	public String getWorld()
	{
		return this.world;
	}

	public void setWorld(String world)
	{
		this.world = world;
	}

}
