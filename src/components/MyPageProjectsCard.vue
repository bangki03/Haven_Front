<template>
    <div style="height: 100%; width: 100%;">
        <div class="row" style="height: 60%; width:100%; margin:0; border-radius: 0.5em; border: 1px solid black;">
            <p style="margin: 0;"> [project_name] : {{ project_SummaryCard.project_name }}</p>
            <p style="margin: 0;"> [project_type] : {{ project_SummaryCard.project_type }}</p>
            <p style="margin: 0;"> [factory_name] : {{ project_SummaryCard.factory_name }}</p>
            <p style="margin: 0;"> [product_name] : {{ project_SummaryCard.product_name }}</p>
            <p style="margin: 0;"> [process_name] : {{ project_SummaryCard.process_name }}</p>
        </div>
        <div class="row" style="height: 5%; width:100%; "></div>
        <div class="row" style="height: 35%; width:100%; margin:0; border: 1px solid black;">
            <p style="margin: 0; text-align: left;"> [project_name] : {{ project_SummaryCard.project_name }}</p>
            <p style="margin: 0; text-align: left;"> {{ project_SummaryCard.project_script }}</p>
        </div>
    </div>
</template>

<script>

export default{
    props: ['project_SummaryCard']
}
</script>

<style>
</style>