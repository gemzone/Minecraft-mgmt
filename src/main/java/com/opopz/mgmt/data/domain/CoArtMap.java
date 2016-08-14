package com.opopz.mgmt.data.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * CoArtMap generated by hbm2java
 */
@Entity
@Table(name = "co_art_map", catalog = "co")
public class CoArtMap implements java.io.Serializable
{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Integer rowid;
	private Integer id;
	private String art;

	public CoArtMap()
	{
	}

	public CoArtMap(Integer id, String art)
	{
		this.id = id;
		this.art = art;
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

	@Column(name = "art")
	public String getArt()
	{
		return this.art;
	}

	public void setArt(String art)
	{
		this.art = art;
	}

}